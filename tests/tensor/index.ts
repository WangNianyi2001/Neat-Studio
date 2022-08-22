import Tensor from '@util/tensor';

const a = new Tensor([1, 2, 3]);
console.log(a.toString());
console.assert(a.Equal(a.Scale(1.1)));
console.log(a.toString());
console.log(a.Scale(1.1).toString());
console.log(a.Equal(a.Scale(1.1)));
