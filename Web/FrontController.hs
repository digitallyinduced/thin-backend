module Web.FrontController where

import IHP.RouterPrelude
import Web.Controller.Prelude
import Web.View.Layout (defaultLayout)
import qualified IHP.DataSync.Role as Role

import IHP.DataSync.Types
import IHP.DataSync.Controller
import IHP.DataSync.REST.Types
import IHP.DataSync.REST.Controller

import IHP.LoginSupport.Middleware
import Web.Controller.Sessions
import Web.Controller.Users
import Web.Controller.JWT
import Application.Auth

-- Controller Imports
import Web.Controller.Static
import IHP.GraphQL.GraphQLWS

instance FrontController WebApplication where
    controllers = 
        [ startPage WelcomeAction
        , routeGraphQLWS
        , webSocketApp @DataSyncController
        , parseRoute @ApiController
        , parseRoute @SessionsController
        , parseRoute @UsersController
        , parseRoute @JWTController
        -- Generator Marker
        ]

instance InitControllerContext WebApplication where
    initContext = do
        setLayout defaultLayout
        initAutoRefresh
        initAuthentication @User
        initJWTAuthentication @User
        Role.ensureAuthenticatedRoleExists