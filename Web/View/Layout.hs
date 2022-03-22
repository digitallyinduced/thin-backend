module Web.View.Layout (defaultLayout, statusLayout, Html) where

import IHP.ViewPrelude
import IHP.Environment
import qualified Text.Blaze.Html5            as H
import qualified Text.Blaze.Html5.Attributes as A
import Generated.Types
import IHP.Controller.RequestContext
import Web.Types
import Web.Routes
import Application.Helper.View

defaultLayout :: Html -> Html
defaultLayout inner = H.docTypeHtml ! A.lang "en" $ [hsx|
<head>
    {metaTags}

    {stylesheets}
    {scripts}
    <link rel="shortcut icon" type="image/x-icon" href="https://ihp.digitallyinduced.com/ihp-logo.svg">

    <title>{pageTitleOrDefault appName}</title>
</head>
<body>
    <div class="container mt-4">
        {renderFlashMessages}
        {inner}
    </div>
</body>
|]

statusLayout :: Html -> Html
statusLayout inner = H.docTypeHtml ! A.lang "en" $ [hsx|
<head>
    {metaTags}

    <link rel="stylesheet" href={assetPath "/vendor/bootstrap.min.css"}/>
    <link rel="stylesheet" href={assetPath "/status.css"}/>

    <link rel="shortcut icon" type="image/x-icon" href="/icon.png">

    <title>Thin Backend GraphQL Server</title>
</head>
<body>
    {inner}
    
    {when isDevelopment devScripts}
    <script src={assetPath "/vendor/jquery-3.6.0.min.js"}></script>
    <script src={assetPath "/vendor/popper.min.js"}></script>
    <script src={assetPath "/vendor/bootstrap.min.js"}></script>
    <script src={assetPath "/vendor/clipboard.min.js"}></script>
    <script>new ClipboardJS('[data-clipboard-text]');</script>
</body>
|]

-- The 'assetPath' function used below appends a `?v=SOME_VERSION` to the static assets in production
-- This is useful to avoid users having old CSS and JS files in their browser cache once a new version is deployed
-- See https://ihp.digitallyinduced.com/Guide/assets.html for more details

stylesheets :: Html
stylesheets = [hsx|
        <link rel="stylesheet" href={assetPath "/vendor/bootstrap.min.css"}/>
        <link rel="stylesheet" href={assetPath "/app.css"}/>
    |]

scripts :: Html
scripts = [hsx|
        {when isDevelopment devScripts}
    |]

devScripts :: Html
devScripts = [hsx|
        <script id="livereload-script" src={assetPath "/livereload.js"}></script>
    |]

metaTags :: Html
metaTags = [hsx|
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
    <meta property="og:title" content={appName}/>
    <meta property="og:type" content="website"/>
    <meta property="og:url" content="TODO"/>
    <meta property="og:description" content={"Login or Sign up to " <> appName}/>
|]
