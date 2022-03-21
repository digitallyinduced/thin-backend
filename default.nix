{
    additionalNixpkgsOptions ? {},
    worker ? false,
    optimized ? false,
    withDevTools ? true
}:
let
    ihp = builtins.fetchGit {
        url = "https://github.com/digitallyinduced/ihp.git";
        rev = "b5f40b855f7c72c6e0d8f30c094833c3999fb7c1";
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
