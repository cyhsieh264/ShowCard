 //override prototype.toObject and add your custom properties here
 fabric.Object.prototype.toObject = (function(toObject) {
  return function() {
      return fabric.util.object.extend(toObject.call(this), {
          customId: this.customId, // custom property
      });
  };
})(fabric.Object.prototype.toObject);