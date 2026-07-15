const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Buffer Operations', () => {
  describe('Buffer Creation', () => {
    it('should create buffer from string', () => {
      const buf = Buffer.from('Hello World', 'utf8');
      assert.ok(buf);
      assert.strictEqual(buf.toString(), 'Hello World');
    });

    it('should create buffer with alloc', () => {
      const buf = Buffer.alloc(10);
      assert.strictEqual(buf.length, 10);
    });

    it('should create buffer from array', () => {
      const buf = Buffer.from([72, 101, 108, 108, 111]);
      assert.strictEqual(buf.toString(), 'Hello');
    });

    it('should have correct length', () => {
      const buf = Buffer.from('Node.js', 'utf8');
      assert.strictEqual(buf.length, 7);
    });
  });

  describe('Buffer Operations', () => {
    it('should slice buffer correctly', () => {
      const buf = Buffer.from('Hello World');
      const sliced = buf.slice(0, 5);
      assert.strictEqual(sliced.toString(), 'Hello');
    });

    it('should write to buffer', () => {
      const buf = Buffer.alloc(20);
      buf.write('Test');
      assert.ok(buf.toString().includes('Test'));
    });

    it('should access buffer by index', () => {
      const buf = Buffer.from('A');
      assert.strictEqual(buf[0], 65); // ASCII value of 'A'
    });

    it('should concatenate buffers', () => {
      const buf1 = Buffer.from('Hello ');
      const buf2 = Buffer.from('World');
      const combined = Buffer.concat([buf1, buf2]);
      assert.strictEqual(combined.toString(), 'Hello World');
    });
  });

  describe('Buffer Comparison', () => {
    it('should compare equal buffers', () => {
      const buf1 = Buffer.from('ABC');
      const buf2 = Buffer.from('ABC');
      assert.strictEqual(buf1.equals(buf2), true);
    });

    it('should identify unequal buffers', () => {
      const buf1 = Buffer.from('ABC');
      const buf2 = Buffer.from('ABD');
      assert.strictEqual(buf1.equals(buf2), false);
    });

    it('should compare using compare method', () => {
      const buf1 = Buffer.from('ABC');
      const buf2 = Buffer.from('ABD');
      assert.ok(buf1.compare(buf2) < 0);
    });
  });

  describe('Buffer Encoding', () => {
    it('should encode to hex', () => {
      const buf = Buffer.from('Hello', 'utf8');
      const hex = buf.toString('hex');
      assert.ok(hex.length > 0);
    });

    it('should encode to base64', () => {
      const buf = Buffer.from('Node.js', 'utf8');
      const base64 = buf.toString('base64');
      assert.strictEqual(base64, 'Tm9kZS5qcw==');
    });

    it('should decode from base64', () => {
      const encoded = Buffer.from('Tm9kZS5qcw==', 'base64');
      assert.strictEqual(encoded.toString('utf8'), 'Node.js');
    });

    it('should support utf8 encoding', () => {
      const buf = Buffer.from('Hello', 'utf8');
      assert.strictEqual(buf.toString('utf8'), 'Hello');
    });
  });

  describe('Buffer Iteration', () => {
    it('should iterate with forEach', () => {
      const buf = Buffer.from('ABC');
      let count = 0;
      buf.forEach(() => count++);
      assert.strictEqual(count, 3);
    });

    it('should access elements with for loop', () => {
      const buf = Buffer.from('ABC');
      assert.strictEqual(buf[0], 65);
      assert.strictEqual(buf[1], 66);
      assert.strictEqual(buf[2], 67);
    });

    it('should have correct length property', () => {
      const buf = Buffer.from('Hello');
      assert.strictEqual(buf.length, 5);
    });
  });

  describe('Buffer Conversion', () => {
    it('should convert to JSON', () => {
      const buf = Buffer.from('Test');
      const json = buf.toJSON();
      assert.ok(json.type === 'Buffer');
      assert.ok(Array.isArray(json.data));
    });

    it('should convert to string', () => {
      const buf = Buffer.from('Node.js');
      assert.strictEqual(buf.toString(), 'Node.js');
    });

    it('should support different encodings in toString', () => {
      const buf = Buffer.from('Hello');
      assert.ok(buf.toString('utf8'));
      assert.ok(buf.toString('hex'));
      assert.ok(buf.toString('base64'));
    });
  });

  describe('Buffer Edge Cases', () => {
    it('should handle empty buffer', () => {
      const buf = Buffer.alloc(0);
      assert.strictEqual(buf.length, 0);
    });

    it('should handle large buffer', () => {
      const buf = Buffer.alloc(1000000);
      assert.strictEqual(buf.length, 1000000);
    });

    it('should handle special characters', () => {
      const buf = Buffer.from('hello\nworld', 'utf8');
      assert.ok(buf.toString().includes('\n'));
    });
  });
});
