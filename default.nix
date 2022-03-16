{ additionalNixpkgsOptions ? {}, worker ? false }:
let
    ihp = builtins.fetchGit {
        url = "https://github.com/digitallyinduced/ihp.git";
        rev = "efb192e794947bd11d9ab461f0e31ebbd0388661";
        allRefs = true;
    };
    haskellEnv = import "${ihp}/NixSupport/default.nix" {
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
    };
in
    haskellEnv
