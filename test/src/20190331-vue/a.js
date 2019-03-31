export default {
  data: () => ({
    count: 0
  }),
  created: function () {
  },
  methods: {
    add: function () {
      this.count++
      console.log(`a.add() ${this.count}`)
    }
  }
}