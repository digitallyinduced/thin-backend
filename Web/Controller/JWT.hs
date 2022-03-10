module Web.Controller.JWT where

import Web.Controller.Prelude
import qualified Network.URI.Encode as URI
import qualified Web.JWT as JWT
import qualified Data.Map as Map
import qualified Data.Maybe as Maybe
import qualified Data.ByteString as BS
import qualified Data.Time.Clock.POSIX as Time
import qualified Network.URI as URI
import qualified Network.HTTP.Types as URI
import qualified Blaze.ByteString.Builder as BS

instance Controller JWTController where
    action JWTAction { userId, accessToken } = do
        user <- fetch userId
        accessDeniedUnless (get #accessToken user == Just accessToken)


        let lifetime = 60 * 60 * 24 * 3

        createdAt <- getCurrentTime
        expiredAt <- addUTCTime lifetime <$> getCurrentTime
    
        let claimsSet = mempty
                { JWT.iss = (JWT.stringOrURI "https://ihp-identity.digitallyinduced.com/")
                , JWT.sub = JWT.stringOrURI (tshow (get #id user))
                , JWT.iat = JWT.numericDate (Time.utcTimeToPOSIXSeconds createdAt)
                , JWT.exp = JWT.numericDate (Time.utcTimeToPOSIXSeconds expiredAt)
                }
    
        let token = JWT.encodeSigned (getAppConfig @JWT.Signer) mempty claimsSet

        renderPlain (cs token)