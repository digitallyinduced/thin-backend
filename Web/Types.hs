module Web.Types where

import IHP.Prelude
import IHP.ModelSupport
import Generated.Types
import IHP.LoginSupport.Types

data WebApplication = WebApplication deriving (Eq, Show)


data StaticController = WelcomeAction deriving (Eq, Show, Data)

data SessionsController
    = NewSessionAction
    | CreateSessionAction
    | DeleteSessionAction
    deriving (Eq, Show, Data)

data UserController
    = UserAction
    deriving (Eq, Show, Data)

data UsersController
    = NewUserAction
    | CreateUserAction
    | ConfirmUserAction { userId :: !(Id User), confirmationToken :: !Text }
    deriving (Eq, Show, Data)

instance HasNewSessionUrl User where
    newSessionUrl _ = "/NewSession"

type instance CurrentUserRecord = User


data JWTController
    = JWTAction { userId :: !(Id User), accessToken :: Text }
    deriving (Eq, Show, Data)

data FunctionCallResult = FunctionCallResult
    { exitCode :: !Int
    , stdout :: !Text
    , stderr :: !Text
    }