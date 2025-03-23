{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
    treefmt-nix.url = "github:numtide/treefmt-nix";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      treefmt-nix,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        deps = [ ];
        devDeps = [ ];

        treefmtEval = treefmt-nix.lib.evalModule pkgs (
          { ... }:
          {
            projectRootFile = "flake.nix";
            programs.nixfmt.enable = true;
            programs.prettier.enable = true;
          }
        );
      in
      {
        checks = {
          formatting = treefmtEval.config.build.check self;
        };

        devShell = nixpkgs.legacyPackages.${system}.mkShell {
          buildInputs = deps ++ devDeps;
        };

        formatter = treefmtEval.config.build.wrapper;
      }
    );
}
