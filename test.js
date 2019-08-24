async updateSimpleMenu (message, data) {
    const { state, meta, title, emoji, options, timeoutSeconds } = data
    const currentMenu = await this._commander.getCurrentMenu(message.channel_id, message.author.id)
    const menuKey = `framework:menus:${message.channel_id}:${message.author.id}`
    const now = Date.now()
    const multi = this.cache.multi()
    .hset(menuKey, 'plugin', this.name)
    .hset(menuKey, 'state', state)
    .hset(menuKey, 'title', title || currentMenu.title)
    .hset(menuKey, 'options', JSON.stringify(options || null))
    .hset(menuKey, 'meta', JSON.stringify(meta || null))
    .hset(menuKey, 'type', 'text')
    .hset(menuKey, 'updatedAt', now)
    .expire(menuKey, Math.ceil(timeoutSeconds || 120) + 5)
    await multi.execAsync()
    const menuMessageData = this.getMenuMessage(message, currentMenu, data, 'text')
    setTimeout(async () => {
      const currentMenu = await this._commander.getCurrentMenu(message.channel_id, message.author.id)
      if (currentMenu.state === state && currentMenu.updatedAt == now) {
        await this.deleteMenu(message)
        await this.reply(message, 'no', `**${message.author.username}**, the command menu has closed due to inactivity.`)
      }
    }, (timeoutSeconds || 120) * 1000)
    if (currentMenu.state) {
      try {
        await this.editMessage({
          id: currentMenu.messageId,
          channel_id: message.channel_id
        }, emoji || 'info', menuMessageData)
      } catch (error) {
        await this.deleteMessage({
          id: currentMenu.messageId,
          channel_id: message.channel_id
        })
        const menuMessage = await this.reply(message, emoji || 'info', menuMessageData)
        await this.cache.hset(menuKey, 'messageId', menuMessage.id)
      }
    } else {
      const menuMessage = await this.reply(message, emoji || 'info', menuMessageData)
      await this.cache.hset(menuKey, 'messageId', menuMessage.id)
    }
  }



  async discordMessage (message) {
    if (!message.author || message.author.bot) return
    const menuData = await this.getCurrentMenu(message.channel_id, message.author.id)
    if (menuData.state) {
      const plugin = this.plugins.find(plugin => plugin.name.toLowerCase() === menuData.plugin.toLowerCase())
      try {
        plugin._handleMenu(message, menuData)
      } catch (error) {
        console.error(error)
      }
    } else {
      // do command
    }
  }