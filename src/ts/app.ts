const fetchData = async () => {
  const res = await fetch('https://fakestoreapi.com/products');
  const data = await res.json();
  console.log(data);
};

fetchData();

const fetchData2 = async () => {
  const res = await fetch('https://fakestoreapi.com/products/1');
  const data = await res.json();
  console.log(data);
};

fetchData2();
