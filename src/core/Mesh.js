phina.namespace(function() {

  phina.define("glb.Mesh", {
    superClass: "glb.Object3D",

    init: function(geometry, material) {
      this.superInit();

      this.geometry = geometry;
      this.material = material;
    },

    setGeometry: function(geometry) {
      this.geometry = geometry;
      return this;
    },
    getMaterial: function(material) {
      this.material = material;
      return this;
    },

    build: function(glLayer) {
      var gl = glLayer.gl;
      var ext = glLayer.ext;

      this.geometry.build(glLayer);
      this.material.build(glLayer);

      if (ext !== null) {
        this.material.setVao(glLayer);
        this.material.setAttributes(glLayer, this.geometry);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.index);
        this.material.unsetVao(glLayer);
      }
    },

    render: function(glLayer, vpMatrix, light) {
      var gl = glLayer.gl;
      var ext = glLayer.ext;

      if (this.needsUpdate) this.updateMatrix();
      this.getWorldMatrix();

      this.material.setProgram(glLayer);

      if (ext !== null) {
        this.material.setVao(glLayer);
      } else {
        this.material.setAttributes(glLayer, this.geometry);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.index);
      }
      this.material.setTextures(glLayer);

      if (this.material.uniforms.invMatrix) {
        mat4.invert(this.invMatrix.array, glb.Matrix4.mul(vpMatrix, this.worldMatrix).array);
        this.material.setUniform(glLayer, "invMatrix", this.invMatrix);
      }
      this.material.setUniforms(glLayer, this);
      this.material.setUniform(glLayer, "vpMatrix", vpMatrix);

      if (light) {
        this.material.setUniform(glLayer, "lightDirection", light.lightDirection);
        this.material.setUniform(glLayer, "lightColor", light.lightColor);
        this.material.setUniform(glLayer, "ambientColor", light.ambientColor);
      }

      this.material.draw(glLayer, this.geometry.indexData.length);

      if (ext !== null) this.material.unsetVao(glLayer);
    },

    raycast: function(ray) {
      // localize
      if (this.parent.getWorldMatrix) {
        var m = this.parent.getWorldMatrix().invert();
        return ray.transformMat4(m);
      }

      var result = null;
      var exists = this.geometry.triangles.some(function(triangle) {
        return result = ray.intersectTriangle(triangle.a, triangle.b, triangle.c);
      });
      if (exists) {
        return result;
      } else {
        return null;
      }
    },

    clone: function() {
      return glb.Mesh(this.geometry, this.material);
    },

  });

});
