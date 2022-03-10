{-# LANGUAGE AllowAmbiguousTypes #-}

module Application.Auth (initJWTAuthentication) where

import IHP.Prelude
import IHP.LoginSupport.Helper.Controller
import IHP.Controller.Session
import IHP.QueryBuilder
import IHP.Fetch
import IHP.ControllerSupport
import IHP.ModelSupport
import IHP.Controller.Context
import IHP.Controller.Param
import qualified Web.JWT as JWT
import qualified Data.ByteString as BS
import qualified Data.Maybe as Maybe
import qualified Data.Text as Text

{-# INLINE initJWTAuthentication #-}
initJWTAuthentication :: forall user normalizedModel.
        ( ?context :: ControllerContext
        , ?modelContext :: ModelContext
        , normalizedModel ~ NormalizeModel user
        , Typeable normalizedModel
        , Table normalizedModel
        , FromRow normalizedModel
        , PrimaryKey (GetTableName normalizedModel) ~ UUID
        , GetTableName normalizedModel ~ GetTableName user
        , FilterPrimaryKey (GetTableName normalizedModel)
        , KnownSymbol (GetModelName user)
    ) => IO ()
initJWTAuthentication = do
    let accessTokenQueryParam = (paramOrNothing  "access_token")
    let accessToken :: Maybe Text = accessTokenQueryParam <|> jwtFromAuthorizationHeader
    case accessToken of
        Just accessToken -> do
            let signature = JWT.decodeAndVerifySignature (getAppConfig @JWT.Signer) accessToken

            case signature of
                Just jwt -> do
                    let userId :: Id user = jwt
                            |> JWT.claims
                            |> JWT.sub
                            |> Maybe.fromMaybe (error "JWT missing sub")
                            |> JWT.stringOrURIToText
                            |> textToId

                    user <- fetchOneOrNothing userId
                    putContext user
                Nothing -> error "Invalid signature"
        Nothing -> pure ()

jwtFromAuthorizationHeader :: (?context :: ControllerContext) => Maybe Text
jwtFromAuthorizationHeader = do
    case getHeader "Authorization" of
        Just authHeader -> authHeader
                |> cs
                |> Text.stripPrefix "Bearer "
                |> Maybe.fromMaybe (error "Invalid format of Authorization header, expected 'Bearer <jwt>'")
                |> Just
        Nothing -> Nothing