module Application.Helper.Controller where

import IHP.ControllerPrelude
import Config

-- Here you can add functions which are available in all your controllers

emailConfirmationRequired :: (?context :: ControllerContext) => Bool
emailConfirmationRequired = getAppConfig @EmailConfirmationRequired
    |> \case EmailConfirmationRequired value -> value