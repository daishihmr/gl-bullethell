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

    intersectTriangle: function(a, b, c) {
      var normal = glb.Vector3.sub(b, a).cross(glb.Vector3.sub(c, b));
      var va = glb.Vector3.sub(this.origin, a);

      if (this.direction.dot(normal) == 0) {
        return null;
      }

      var distance = va.dot(normal) / this.direction.dot(normal);
      if (distance < 0) {
        return null;
      }

      var p = this.origin.clone().add(this.direction.mul(distance));

      var ab = glb.Vector3.sub(b, a);
      var ap = glb.Vector3.sub(p, a);
      if (ab.cross(ap).dot(normal) < 0) {
        return null;
      }

      var bc = glb.Vector3.sub(c, b);
      var bp = glb.Vector3.sub(p, b);
      if (bc.cross(bp).dot(normal) < 0) {
        return null;
      }

      var ca = glb.Vector3.sub(a, c);
      var cp = glb.Vector3.sub(p, c);
      if (ca.cross(cp).dot(normal) < 0) {
        return null;
      }

      return p;
    },

  });

});
