let
    ihp = builtins.fetchGit {
        url = "https://github.com/digitallyinduced/ihp.git";
        rev = "9aeb0547861e205b9b2dec23a5626e6579783c48";
        allRefs = true;
    };
    pkgs = import ./../Config/nix/nixpkgs-config.nix {
        ihp = ihp;
        additionalNixpkgsOptions = {};
    };
    ghc = pkgs.haskell.packages.ghc8107;
    haskellDeps = ghc.ghcWithPackages (p: with p; [
        mmark-cli
    ]);
in
    pkgs.stdenv.mkDerivation {
        name = "thin-backend-docs";
        src = ./.;
        buildInputs = [haskellDeps pkgs.entr pkgs.nodejs];
        shellHook = "eval $(egrep ^export ${haskellDeps}/bin/ghc)";
    }
