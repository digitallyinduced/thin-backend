module Web.Routes where
import IHP.RouterPrelude
import Generated.Types
import Web.Types
import IHP.DataSync.REST.Routes

-- Generator Marker
instance AutoRoute StaticController
instance AutoRoute SessionsController
instance AutoRoute UsersController

instance CanRoute UserController where
    parseRoute' = do
        string "/api/user"
        onlyAllowMethods [GET]
        pure UserAction

instance HasPath UserController where
    pathTo UserAction = "/api/user"

instance AutoRoute JWTController
