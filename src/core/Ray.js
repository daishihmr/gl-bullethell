phina.namespace(function() {
  
  phina.define("glb.Ray", {

    init: function(origin, direction) {
      if (origin instanceof glb.Vector3) {
        this.origin = origin;
      } else {
        this.origin = glb.Vector3(origin[0], origin[1], origin[2]);
      }
      if (direction instanceof glb.Vector3) {
        this.direction = direction;
      } else {
        this.direction = glb.Vector3(direction[0], direction[1], direction[2]);
      }
      this.direction.normalize();
    },
    
    transformMat4: function(m) {
      this.origin.transformMat4(m);
      this.direction.transformMat4(m);
      return this;
    },

    intersectTriangle: function(a, b, c) {
      var v3 = glb.Vector3;
      var normal = v3.sub(b, a).cross(v3.sub(c, b)).normalize();

      if (this.direction.dot(normal) == 0) {
        return null;
      }

      var va = v3.sub(a, this.origin);
      var distance = va.dot(normal) / this.direction.dot(normal);
      if (distance < 0) {
        return null;
      }

      var p = v3.add(this.origin, this.direction.mul(distance));

      var ab = v3.sub(b, a);
      var ap = v3.sub(p, a);
      if (ab.cross(ap).dot(normal) < 0) {
        return null;
      }

      var bc = v3.sub(c, b);
      var bp = v3.sub(p, b);
      if (bc.cross(bp).dot(normal) < 0) {
        return null;
      }

      var ca = v3.sub(a, c);
      var cp = v3.sub(p, c);
      if (ca.cross(cp).dot(normal) < 0) {
        return null;
      }

      return p;
    },

  });

});
