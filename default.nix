{ additionalNixpkgsOptions ? {}, worker ? false }:
let
    ihp = builtins.fetchGit {
        url = "https://github.com/digitallyinduced/ihp.git";
        rev = "9aeb0547861e205b9b2dec23a5626e6579783c48";
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
