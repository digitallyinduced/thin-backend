module Web.View.Users.New where
import Web.View.Prelude

data NewView = NewView { user :: User }

instance View NewView where
    html NewView { .. } = [hsx|

        <div class="h-100" id="sessions-new">
            <div class="d-flex align-items-center">
                <div class="w-100">
                    <div style="max-width: 400px" class="mx-auto mt-5 p-5 shadow-lg rounded">
                        <div class="text-center mb-3">
                            <img src={appIcon} id="app-icon"/>
                        </div>


                        <h1 class="text-center mb-3">Register</h1>
                        
                        <p class="text-center">
                            Sign up for an account to use {appName}.
                        </p>
                        {renderForm user}

                        <p>
                            <span class="text-muted mr-1">Already have an account?</span> <a href={NewSessionAction}>Log in</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    |]

renderForm :: User -> Html
renderForm user = formFor user [hsx|
    {(textField #email) { fieldClass = "form-control-lg", fieldLabel = "E-Mail", placeholder = "E-Mail" }}
    {(passwordField #passwordHash) { fieldClass = "form-control-lg", placeholder = "Password", fieldLabel = "Password" }}
    
    <div class="form-group">
        <button type="submit" class="btn btn-lg btn-primary btn-block">
            <span class="button-text">Sign up</span>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        </button>
    </div>
|]
