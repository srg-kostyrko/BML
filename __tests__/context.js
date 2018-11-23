const { ctx, Context } = require('../lib');

describe('context', () => {
  describe('it should support dot notation', () => {
    it('should get value', () => {
      const context = new Context();
      context.fill({
        first: {
          second: {
            third: 1,
          },
        },
      });
      expect(context.get('first.second.third')).toBe(1);
      expect(context.get('first.second.unknown')).toBeUndefined();
      expect(context.get('first.unknown.unknown')).toBeUndefined();
      expect(context.get('unknown.unknown.unknown')).toBeUndefined();
    });

    it('should get value from parent context', () => {
      const parent = new Context();
      parent.fill({
        first: {
          second: {
            third: 1,
          },
        },
      });
      const context = new Context(parent);
      expect(context.get('first.second.third')).toBe(1);
      expect(context.get('first.second.unknown')).toBeUndefined();
      expect(context.get('first.unknown.unknown')).toBeUndefined();
      expect(context.get('unknown.unknown.unknown')).toBeUndefined();
    });

    it('should set value', () => {
      const context = new Context();
      context.set('first.second.third', 1);
      expect(context.get('first')).toEqual({
        second: {
          third: 1,
        },
      });
    });
  });
  describe('context functions', () => {
    const context = new Context();
    context.fill({
      min: 1,
      value: 5,
      otherValue: 5,
      max: 10,
    });

    it('should create function that get property from context', () => {
      expect(ctx`value`(context)).toBe(5);
      expect(ctx`missing`(context)).toBeUndefined();
    });

    it('should allow eq chain able to calculate from context', () => {
      expect(ctx`value`.eq(ctx`otherValue`)(context)).toBe(true);
      expect(ctx`value`.eq(ctx`min`)(context)).toBe(false);
      expect(ctx`value`.eq(5)(context)).toBe(true);
      expect(ctx`value`.eq(6)(context)).toBe(false);
    });

    it('should allow neq chain able to calculate from context', () => {
      expect(ctx`value`.neq(ctx`otherValue`)(context)).toBe(false);
      expect(ctx`value`.neq(ctx`min`)(context)).toBe(true);
      expect(ctx`value`.neq(5)(context)).toBe(false);
      expect(ctx`value`.neq(6)(context)).toBe(true);
    });

    it('should allow lt chain able to calculate from context', () => {
      expect(ctx`value`.lt(ctx`otherValue`)(context)).toBe(false);
      expect(ctx`value`.lt(ctx`max`)(context)).toBe(true);
      expect(ctx`value`.lt(5)(context)).toBe(false);
      expect(ctx`value`.lt(6)(context)).toBe(true);
    });

    it('should allow lte chain able to calculate from context', () => {
      expect(ctx`value`.lte(ctx`otherValue`)(context)).toBe(true);
      expect(ctx`value`.lte(ctx`max`)(context)).toBe(true);
      expect(ctx`value`.lte(ctx`min`)(context)).toBe(false);
      expect(ctx`value`.lte(4)(context)).toBe(false);
      expect(ctx`value`.lte(5)(context)).toBe(true);
      expect(ctx`value`.lte(6)(context)).toBe(true);
    });

    it('should allow glt chain able to calculate from context', () => {
      expect(ctx`value`.gt(ctx`otherValue`)(context)).toBe(false);
      expect(ctx`value`.gt(ctx`min`)(context)).toBe(true);
      expect(ctx`value`.gt(5)(context)).toBe(false);
      expect(ctx`value`.gt(4)(context)).toBe(true);
    });

    it('should allow gte chain able to calculate from context', () => {
      expect(ctx`value`.gte(ctx`otherValue`)(context)).toBe(true);
      expect(ctx`value`.gte(ctx`max`)(context)).toBe(false);
      expect(ctx`value`.gte(ctx`min`)(context)).toBe(true);
      expect(ctx`value`.gte(4)(context)).toBe(true);
      expect(ctx`value`.gte(5)(context)).toBe(true);
      expect(ctx`value`.gte(6)(context)).toBe(false);
    });
  });
});
