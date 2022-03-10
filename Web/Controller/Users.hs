module Web.Controller.Users where

import Web.Controller.Prelude
import Web.View.Users.New
-- import qualified IHP.AuthSupport.Controller.Confirmations as Confirmations
import qualified Web.Controller.Sessions ()
-- import IHP.AuthSupport.Confirm
-- import Web.Mail.Users.ConfirmationMail

instance Controller UsersController where
    action NewUserAction = do
        let user = newRecord
        render NewView { .. }

    action CreateUserAction = do
        let user = newRecord @User
        user
            |> fill @["email", "passwordHash"]
            |> validateField #email isEmail
            |> validateField #passwordHash nonEmpty
            |> ifValid \case
                Left user -> render NewView { .. } 
                Right user -> do
                    hashed <- hashPassword (get #passwordHash user)
                    token <- generateAuthenticationToken
                    user <- user
                        |> set #passwordHash hashed
                        |> setJust #accessToken token
                        |> set #isConfirmed (not emailConfirmationRequired)
                        |> createRecord

                    -- if emailConfirmationRequired
                    --     then do
                    --         setSuccessMessage $ "Welcome onboard! Before you can start, please quickly confirm your email address by clicking the link we've sent to " <> get #email user
                    --         sendConfirmationMail user
                    --     else do
                    login user
                    redirectTo NewSessionAction

    -- action ConfirmUserAction { userId, confirmationToken } = Confirmations.confirmAction userId confirmationToken

-- instance Confirmations.ConfirmationsControllerConfig User where