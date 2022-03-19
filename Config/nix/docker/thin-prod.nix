{ localPkgs ? import <nixpkgs> {}
, imagePkgs ? import <nixpkgs> { system = "x86_64-linux"; }
, ihpApp ? import ./../../../default.nix {
    additionalNixpkgsOptions = { system = "x86_64-linux"; };
    withDevTools = false;
  }
}:
localPkgs.dockerTools.buildImage {
  name = "thin-backend-prod";
  config = {
    Cmd = [ "${ihpApp}/bin/RunProdServer" ];
    WorkingDir = "/home/app";
    ExposedPorts = {
      "8000/tcp" = {};
    };
  };
  extraCommands = ''
    mkdir -p home/app/build
    mkdir -p home/app/Application home/app/Application/Migration
    touch home/app/Application/Fixtures.sql
    cp ${ihpApp}/lib/Schema.sql home/app/Application/Schema.sql
    chmod -R 777 home/app
    ln -s ${ihpApp}/lib/build/ihp-lib home/app/build/ihp-lib
  '';
  contents = [imagePkgs.cacert];
}