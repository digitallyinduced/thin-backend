module Config where

import IHP.Prelude
import IHP.Environment
import IHP.FrameworkConfig
import qualified Network.Wai.Middleware.Cors as Cors
import qualified Data.ByteString as BS
import qualified Web.JWT as JWT
import qualified Data.Maybe as Maybe
import qualified IHP.Log.Types as Log
import IHP.Mail

import qualified System.Directory as Directory
import OpenSSL.RSA as OpenSSL
import OpenSSL.PEM as OpenSSL

config :: ConfigBuilder
config = do
    option (AppHostname "localhost")
    option Cors.simpleCorsResourcePolicy
            { Cors.corsOrigins = Nothing
            , Cors.corsMethods = ["OPTIONS", "GET", "PUT", "POST", "PATCH", "DELETE"]
            , Cors.corsRequestHeaders = ["Authorization", "Content-Type"]
            , Cors.corsMaxAge = Just 180 -- Should be set in production: Just 180, During development set it to Nothing, otherwise CORS headers will not refresh intantly
            }

    frontendUrl <- FrontendUrl <$> envOrDefault "FRONTEND_URL" "http://localhost:3000"
    appName <- AppName <$> envOrDefault "APP_NAME" "App"
    appIcon <- AppIcon <$> envOrDefault "APP_ICON" "https://ihp.digitallyinduced.com/ihp.svg"
    
    option frontendUrl
    option appName
    option appIcon
    
    initJWTPrivateKey

    emailConfirmationRequired <- envOrDefault "AUTH_EMAIL_CONFIRMATION" True
    option (EmailConfirmationRequired emailConfirmationRequired)

    sesAccessKey <- envOrNothing "SES_ACCESS_KEY"
    case sesAccessKey of
        Just sesAccessKey -> do
            sesSecretKey <- env "SES_SECRET_KEY"
            sesRegion <- env "SES_REGION"
            option SES
                { accessKey = sesAccessKey
                , secretKey = sesSecretKey
                , region = sesRegion
                }
        Nothing -> pure ()

initJWTPrivateKey = do
    privateKeyInEnv <- envOrNothing "JWT_PRIVATE_KEY"
    privateKeyText <- case privateKeyInEnv of
        Just privateKey -> pure privateKey
        Nothing -> liftIO do
            jwtExists <- Directory.doesFileExist "Application/jwt.key"
            unless jwtExists do
                (publicKey, privateKey) <- generateKeyPair
                BS.writeFile "Application/jwt.key" privateKey
                BS.writeFile "Application/jwt.pub" publicKey

            BS.readFile "Application/jwt.key"

    let privateKey :: JWT.Signer =
            privateKeyText
            |> JWT.readRsaSecret
            |> Maybe.fromJust
            |> JWT.RSAPrivateKey

    option privateKey

newtype FrontendUrl = FrontendUrl Text
newtype AppName = AppName Text
newtype AppIcon = AppIcon Text

newtype OAuthGoogleEnabled = OAuthGoogleEnabled Bool
newtype EmailConfirmationRequired = EmailConfirmationRequired Bool

hasEnv name = do
    value :: Maybe ByteString <- envOrNothing name
    pure (isJust value)

instance EnvVarReader Bool where
    envStringToValue "true" = Right True
    envStringToValue "false" = Right False
    envStringToValue otherwise    = Left "Expected 'true' or 'false'"

generateKeyPair :: IO (ByteString, ByteString)
generateKeyPair = do
    keyPair <- OpenSSL.generateRSAKey' 2048 65537
    privateKey <- OpenSSL.writePKCS8PrivateKey keyPair Nothing
    publicKey <- OpenSSL.writePublicKey keyPair
    pure (cs publicKey, cs privateKey)