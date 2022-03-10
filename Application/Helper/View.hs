module Application.Helper.View where

import IHP.ViewPrelude
import qualified Config
import IHP.ControllerSupport (getAppConfig)

-- Here you can add functions which are available in all your views

appName :: _ => Text
appName = let
        (Config.AppName value) = getAppConfig
    in
        value

appIcon :: _ => Text
appIcon = let
        (Config.AppIcon value) = getAppConfig
    in
        value