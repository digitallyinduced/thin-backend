module Web.View.Static.Welcome where
import Web.View.Prelude

data WelcomeView = WelcomeView

instance View WelcomeView where
    html WelcomeView = [hsx|
        {navigation}

        <div class="flex-grow-1">
            <div id="bg-container" class="mb-4">
                <h1 class="user-select-none">
                    Your <span class="highlight">GraphQL</span> Server is running!
                </h1>
            </div>

            <section class="text-center mb-5">
                <p class="mb-2 user-select-none">
                    You can make requests to
                </p>

                <div class="d-flex justify-content-center">
                    <span
                        style="cursor: pointer;"
                        class="url"
                        data-clipboard-text="http://localhost:8000/api/graphql"
                        title="Copied!"
                        onclick="$(this).tooltip({title: 'Copied!', placement: 'bottom', trigger: 'manual', container: 'body'}).tooltip('show'); setTimeout(() => $(this).tooltip('hide'), 2000)"
                    >
                        <span style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; display: inline-block" class="mr-3">
                            http://localhost:8000/api/graphql
                        </span>
                        {copyIcon}
                    </span>
                </div>
            </section>

            <section class="text-center">
                <p class="user-select-none mb-2">
                    To open the dev tools:
                </p>

                <a href="http://localhost:8001" class="btn btn-devtools" target="_blank">
                    Dev Tools
                    <span class="btn-arrow">→</span>
                </a>
            </section>
        </div>

        {pageFooter}
    |]


navigation :: Html
navigation = [hsx|
    <nav class="navbar navbar-expand-lg navbar-dark mt-2">
        <a class="navbar-brand" href="/">
            <img src="/logo.png" height="36" class="d-inline-block align-top" alt=""/>
        </a>
    </nav>
|]

pageFooter :: Html
pageFooter = [hsx|
    <footer class="border-top py-1" id="page-footer">
        <div class="d-flex align-items-center">
            

            <nav class="navbar navbar-expand-lg navbar-dark w-100">
                <a class="navbar-brand" href="/">
                    <img src="/logo.png" style="height: 36px" class="d-inline-block"/>
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="https://thinbackend.app/docs/index.html">Docs</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="https://twitter.com/digitallyinduce" target="_blank">Twitter</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="https://ihp.digitallyinduced.com/Slack" target="_blank">Slack</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="https://github.com/digitallyinduced/thin-backend" target="_blank">GitHub</a>
                        </li>
                        <li class="nav-item ml-5">
                            <a class="nav-link" href="https://digitallyinduced.com" target="_blank">© digitally induced, Inc.</a>
                        </li>
                    </ul>
                </div>
            </nav>

        </div>
    </footer>
|]

copyIcon :: Html
copyIcon = preEscapedToHtml [plain|
<svg width="17px" height="17px" viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="FrontEnd" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Vercel-Template" transform="translate(-1003.000000, -281.000000)" fill="#2AA198">
            <g id="Interface-47---24px" transform="translate(1011.500000, 289.500000) scale(-1, 1) translate(-1011.500000, -289.500000) translate(1003.000000, 281.000000)">
                <path d="M10.2,0 L3.4,0 C1.522231,0 0,1.522231 0,3.4 L0,10.2 C0,12.077735 1.522231,13.6 3.4,13.6 C3.4,15.477735 4.922231,17 6.8,17 L9.775,17 L13.6,17 C15.477735,17 17,15.477735 17,13.6 L17,6.8 C17,4.922231 15.477735,3.4 13.6,3.4 C13.6,1.522231 12.077735,0 10.2,0 Z M13.6,5.1 L13.6,10.2 C13.6,12.077735 12.077735,13.6 10.2,13.6 L5.1,13.6 C5.1,14.53891 5.8611155,15.3 6.8,15.3 L9.775,15.3 L13.6,15.3 C14.53891,15.3 15.3,14.53891 15.3,13.6 L15.3,6.8 C15.3,5.8611155 14.53891,5.1 13.6,5.1 Z M1.7,3.4 C1.7,2.4611155 2.4611155,1.7 3.4,1.7 L10.2,1.7 C11.13891,1.7 11.9,2.4611155 11.9,3.4 L11.9,10.2 C11.9,11.13891 11.13891,11.9 10.2,11.9 L3.4,11.9 C2.4611155,11.9 1.7,11.13891 1.7,10.2 L1.7,3.4 Z" id="Shape"></path>
            </g>
        </g>
    </g>
</svg>
|]
