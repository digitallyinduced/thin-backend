{
    additionalNixpkgsOptions ? {},
    worker ? false,
    optimized ? false,
    withDevTools ? true
}:
let
    ihp = builtins.fetchGit {
        url = "https://github.com/digitallyinduced/ihp.git";
        rev = "20c8ff975f889c43ada1f101276e99ccd6994cc9";
        allRefs = true;
    };
    haskellEnv = import ./Config/nix/custom-ihp-build.nix {
        ihp = ihp;
        haskellDeps = p: with p; [
            cabal-install
            base
            wai
            text
            hlint
            p.ihp
            jwt
            HsOpenSSL
        ];
        otherDeps = p: with p; [
            # Native dependencies, e.g. imagemagick
        ];
        projectPath = ./.;
        additionalNixpkgsOptions = additionalNixpkgsOptions;
        optimized = false;
        withDevTools = withDevTools;
        ihpEnv = "Production";
    };
in
    haskellEnv
