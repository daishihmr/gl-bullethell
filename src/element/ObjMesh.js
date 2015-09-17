phina.namespace(function() {

  phina.define("glb.ObjMesh", {
    superClass: "glb.Mesh",

    init: function(name) {
      this.superInit();
      var geo = phina.asset.AssetManager.get("wavefront.obj", name).geometry;
      var mat = glb.PhongMaterial({
        color: phina.util.Color(255, 255, 255, 1),
        image: phina.asset.AssetManager.get("image", name).domElement
      });
      this.superInit(geo, mat);
    },

  });

});
