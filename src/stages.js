const stages = [
    {
      descricao: "Welcome",
      stage: require('./stages/0')
    },
    {
      descricao: "Menu",
      stage: require('./stages/1')
    },
    {
      descricao: "Address",
      stage: require('./stages/2')
    },
    {
      descricao: "Bill",
      stage: require('./stages/3')
    },
    {
      descricao: "New Order",
      stage: require('./stages/4')
    },
    {
      descricao: "Assistant",
      stage: require('./stages/5')
    },
]

module.exports = stages;