<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      test: { a: 1, b: "bbb" },
    };
  },
  mounted() {
    console.log(this.test);
    console.log(u.obj(this.test));
    console.log(this.u.obj(this.test));

    let obj = {
      a: "",
      b: "b",
      c: "   ",
      d: "  d  ",
      e: null,
      f: undefined,
      g: 123,
      h: {
        aa: "",
        bb: "b",
        cb: "   ",
        dd: "  dd  ",
        ee: null,
        ff: undefined,
        gg: 123,
        hh: {
          hha: "",
          hhb: "b",
          hhc: "   ",
          hhd: "  d  ",
          hhe: null,
          hhf: undefined,
          hhg: 123,
          hhh: {
            hhaa: "",
            hhbb: "b",
            hhcb: "   ",
            hhdd: "  dd  ",
            hhee: null,
            hhff: undefined,
            hhgg: 123,
          },
        },
      },
    };
    console.log(u.trim(obj));
    console.log(u.trim(obj), "undefined");
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
