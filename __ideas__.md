Packers are objects that expose the two methods pack(obj) and unpack(data). Intuitively, pack takes an object suitable with that packer and returns a binary representation of it; unpack is the inverse operation, taking a binary representation and returning an object. Here's the most fundamental example:

```javascript
import { byte } from 'bml/tags';

byte``.parse(127);
byte``.unpack('\x7f');
```

(u)int(8|16|24|32|64)
float(32|64)

These can be seen as atoms and BML is a library of combinators: it gains it's power from combining simpler elements into more complex structures. The simplest combinator is `sequence`, which we'll explore by defining an IPv4 address as a sequence of 4 bytes:

```javascript
const ipaddr = sequence``(byte``, byte``, byte``, byte``);
ipaddr.unpack('\x7f\x00\x00\x01'); // [127, 0, 0, 1]
ipaddr.pack([192, 168, 2, 1]);
```

```javascript
const ipaddr = struct(byte`a`, byte`b`, byte`c`, byte`d`);
ipaddr.unpack('\x7f\x00\x00\x01'); // {a: 127, b:0, c:0, d:1}
ipaddr.pack({ a: 192, b: 168, c: 2, d: 1 });
```

Adapters. While at first it may seem confusing, the distinction between adapters and packers is quite clear: packers work at the stream level while adapters work at the object level; this lets you add power without interfering with the low-level machinery.

Generally speaking, we may require access to things we've previously encountered (e.g., the history); for this reason, both packing and unpacking carry a context dictionary with them. This dictionary is mostly maintained by composite packers such as Struct and Sequence, but any packer along the way can both modify and access it, making decisions based on the history.

```javascript
ctx`prop`; // return function that is able either to get data from context or update in context by given path
```

generate contarct to validate input data

probe - The Probe simply dumps information to the screen.

constant
A constant value that is required to exist in the data and match a given value. If the value is not matching, ConstError is raised. Useful for so called magic numbers, signatures, asserting correct protocol version, etc.
By default, Const uses a Bytes field with size matching the value. However, other fields can also be used:

Const(255, Int32ul)

Computed
Represents a value dynamically computed from the context. Computed does not read or write anything to the stream. It only computes a value (usually by extracting a key from a context dictionary) and returns its computed value as the result. Usually Computed fields are used for computations on the context dict.

Default
Allows to make a field have a default value, which comes handly when building a Struct from a dict with missing keys. Only building is affected, parsing is simply deferred to subcon.

Field wrappers
Pointer allows for non-sequential construction. The pointer first moves the stream into new position, does the construction, and then restores the stream back to original position. This allows for random-access within the stream.

> > > d = Pointer(8, Bytes(1))
> > > d.parse(b"abcdefghijkl")
> > > b'i'
> > > d.build(b"Z")
> > > b'\x00\x00\x00\x00\x00\x00\x00\x00Z'
> > > Peek parses a field but restores the stream position afterwards (it does peeking). Building does nothing, it does NOT defer to subcon.

Seek makes a jump within the stream and leaves it there, for other constructs to follow up from that location. It does not read or write anything to the stream by itself.

Tell checks the current stream position and returns it. The returned value gets automatically inserted into the context dictionary. It also does not read or write anything to the stream by itself.

> > > d = Struct("num"/VarInt, "offset"/Tell)

Pass literally does nothing.
