module Web.View.Sessions.New where
import Web.View.Prelude
import IHP.AuthSupport.View.Sessions.New
import qualified Config
import IHP.ControllerSupport (getAppConfig)

instance View (NewView User) where
    html NewView { .. } = [hsx|
        <div class="h-100" id="sessions-new">
            <div class="d-flex align-items-center">
                <div class="w-100">
                    <div style="max-width: 400px" class="mx-auto mt-5 p-5 shadow-lg rounded">
                        <div class="text-center mb-3">
                            <img src={appIcon} id="app-icon"/>
                        </div>

                        <h1 class="text-center mb-3">Welcome</h1>

                        <p class="text-center">
                            Please log in to continue with {appName}.
                        </p>
                        {renderForm user}

                        <p>
                            <span class="text-muted mr-1">Don't have an account?</span> <a href={NewUserAction}>Sign up</a>
                        </p>
                    </div>

                    <div class="text-center mt-5">
                        <a href="https://ihpbackend.digitallyinduced.com/?ref=NewSessionFooter" target="_blank" class="text-muted" id="built-with">Built with IHP Backend</a>
                    </div>
                </div>
            </div>
        </div>

        <script src="/app.js"/>
    |]

renderForm :: User -> Html
renderForm user = [hsx|
    <form method="POST" action={CreateSessionAction}>
        <div class="form-group">
            <input
                name="email"
                value={get #email user}
                type="email"
                class="form-control form-control-lg"
                placeholder="E-Mail"
                required="required"
                autofocus="autofocus"
                autocomplete="email"
            />
        </div>
        <div class="form-group">
            <input
                name="password"
                type="password"
                class="form-control form-control-lg"
                placeholder="Password"
                autocomplete="current-password"
            />
        </div>
        <p>
            <a href="#">Forgot your password?</a>
        </p>
        <div class="form-group">
            <button type="submit" class="btn btn-lg btn-primary btn-block">
                <span class="button-text">Login</span>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            </button>
        </div>
    </form>
|]

