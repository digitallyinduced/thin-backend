module Web.Controller.Static where
import Web.Controller.Prelude
import Web.View.Static.Welcome
import qualified Web.View.Layout as Layout

instance Controller StaticController where
    beforeAction = setLayout Layout.statusLayout
    action WelcomeAction = render WelcomeView
