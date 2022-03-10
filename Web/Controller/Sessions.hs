module Web.Controller.Sessions where

import Web.Controller.Prelude
import Web.View.Sessions.New
import qualified IHP.AuthSupport.Controller.Sessions as Sessions

import qualified IHP.AuthSupport.Controller.Sessions as Sessions
import qualified IHP.AuthSupport.Lockable as Lockable

import qualified Network.URI.Encode as URI
import qualified Web.JWT as JWT
import qualified Data.Map as Map
import qualified Data.Maybe as Maybe
import qualified Data.ByteString as BS
import qualified Data.Time.Clock.POSIX as Time
import qualified Network.URI as URI
import qualified Network.HTTP.Types as URI
import qualified Blaze.ByteString.Builder as BS
import qualified Config

-- import qualified IHP.AuthSupport.Confirm as Confirm

instance Controller SessionsController where
    action NewSessionAction = do
        case paramOrNothing @Text "redirectBack" of
            Just redirectBack -> setSession "redirectBack" redirectBack
            Nothing -> pure ()
        
        case currentUserOrNothing of
            Just user -> do
                redirectBack <- fromMaybe frontendUrl <$> getSession "redirectBack"
                redirectToUrl (addUserTokenParams user redirectBack)
            Nothing -> pure ()


        Sessions.newSessionAction @User
    action CreateSessionAction = do
        query @User
            |> filterWhereCaseInsensitive (#email, param "email")
            |> fetchOneOrNothing
            >>= \case
                Just user -> do
                    isLocked <- Lockable.isLocked user
                    when isLocked do
                        setErrorMessage "User is locked"
                        redirectTo NewSessionAction

                    -- Confirm.ensureIsConfirmed user
                    
                    if verifyPassword user (param @Text "password")
                        then do
                            Sessions.beforeLogin user
                            login user

                            token <- generateAuthenticationToken
                            user <- user
                                    |> set #failedLoginAttempts 0
                                    |> setJust #accessToken token
                                    |> updateRecord

                            redirectBack <- fromMaybe frontendUrl <$> getSession "redirectBack"
                            redirectToUrl (addUserTokenParams user redirectBack)
                        else do
                            setErrorMessage "Invalid Credentials"
                            user :: record <- user
                                    |> incrementField #failedLoginAttempts
                                    |> updateRecord
                            when (get #failedLoginAttempts user >= Sessions.maxFailedLoginAttemps user) do
                                Lockable.lock user
                                pure ()
                            redirectTo NewSessionAction
                Nothing -> do
                    setErrorMessage "Invalid Credentials"
                    redirectTo NewSessionAction
    action DeleteSessionAction = Sessions.deleteSessionAction @User

instance Sessions.SessionsControllerConfig User

frontendUrl :: (?context :: ControllerContext) => Text
frontendUrl = case getAppConfig @Config.FrontendUrl of
    Config.FrontendUrl url -> url

addUserTokenParams :: User -> Text -> Text
addUserTokenParams user redirectBackUrl = patchedUrl
    where
        inputUrl = redirectBackUrl
                |> cs
                |> URI.parseURI
                |> Maybe.fromJust

        newQueryArgs :: URI.QueryText
        newQueryArgs = [
                    ("userId",      Just $ tshow (get #id user)),
                    ("accessToken", get #accessToken user)
                ]
        patchedQuery = inputUrl
                |> get #uriQuery
                |> cs
                |> URI.parseQueryText
                |> (\query -> newQueryArgs <> query)
                |> URI.renderQueryText True
                |> BS.toByteString
                |> cs
        patchedUrl = tshow inputUrl { URI.uriQuery = patchedQuery }
