{
    additionalNixpkgsOptions ? {},
    worker ? false,
    optimized ? false,
    withDevTools ? true
}:
let
    ihp = builtins.fetchGit {
        url = "https://github.com/digitallyinduced/ihp.git";
        rev = "41793f0c2a76fad82a3ae3f1ec0ce1eb413c233b";
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
