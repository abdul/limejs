goog.provide('lime.animation.ScaleBy');


goog.require('lime.Sprite');
goog.require('lime.animation.Animation');
goog.require('goog.math.Vec2');

/**
 * Scale by a factor
 * Also accepts one or two numbers
 * @param {goog.math.Vec2} factor
 * @constructor
 * @extends lime.animation.Animation
 */
lime.animation.ScaleBy = function(factor) {
    lime.animation.Animation.call(this);

    if (arguments.length == 1 && goog.isNumber(factor)) {
        this.factor_ = new goog.math.Vec2(factor, factor);
    }
    else if (arguments.length == 2) {
        this.factor_ = new goog.math.Vec2(arguments[0], arguments[1]);
    }
    else this.factor_ = factor;


};
goog.inherits(lime.animation.ScaleBy, lime.animation.Animation);

lime.animation.ScaleBy.prototype.scope = 'scale';

lime.animation.ScaleBy.prototype.makeTargetProp = function(target) {
    var scale = target.getScale(),
        delta = new goog.math.Vec2(scale.x * this.factor_.x - scale.x,
                                  scale.y * this.factor_.y - scale.y);
                                
    if(this.useTransitions()){
        target.addTransition(lime.Transition.SCALE,
            new goog.math.Vec2(scale.x + delta.x, scale.y + delta.y),
            this.duration_,this.getEasing());
            target.setDirty(lime.Dirty.SCALE);
    }

    return {startScale: scale,
            delta: delta};
};

lime.animation.ScaleBy.prototype.update = function(t,target) {
    if (this.status_ == 0) return;
    var prop = this.getTargetProp(target);

    target.setScale(
        prop.startScale.x + prop.delta.x * t,
        prop.startScale.y + prop.delta.y * t
    );
};

lime.animation.ScaleBy.prototype.clearTransition = function(target){
    if (this.useTransitions()) {
        target.clearTransition(lime.Transition.SCALE);
        target.setDirty(lime.Dirty.SCALE);
    }
};

lime.animation.ScaleBy.prototype.reverse = function() {
    var f = this.factor_.clone();
    f.x = 1 / f.x;
    f.y = 1 / f.y;

    return (new lime.animation.ScaleBy(f)).setDuration(this.getDuration());
};