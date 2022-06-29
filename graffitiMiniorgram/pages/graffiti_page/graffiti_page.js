// pages/graffiti_page/graffiti_page.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        minThickness: 1,                        // 画笔粗细
        maxThickness: 20,
        thickness: 3,
        color: '#545454',                       // 画笔颜色
        alpha: 100,                             // 画笔透明度
        colorArr: [
            '#4A4A4A','#A1C7EE','#EEA1A3','#8EB49B','#D4A5D6','#A5AAD6','#DE7F5F','#DE5F81',
            '#F0F8FF','#FAEBD7','#00FFFF','#7FFFD4','#F0FFFF','#F5F5DC','#FFE4C4','#D2691E',
            '#000000','#FFEBCD','#0000FF','#8A2BE2','#A52A2A','#DEB887','#5F9EA0','#6495ED',
            '#7FFF00','#263464','#008B8B','#A9A9A9','#006400','#556B2F','#8B0000','#2F4F4F'
        ],
    },

    startX: 0,
    startY: 0,
    curDrawArr: [],                             // 单次历史记录
    drawInfosArr: [],                           // 全部历史记录
    // 添加页面属性

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    init: function(){
        const query = wx.createSelectorQuery()
        query.select('#graffitiCanvas')
            .fields({ node: true, size: true })
            .exec((res) => {
                const canvas = res[0].node
                const ctx = canvas.getContext('2d')
                const dpr = wx.getSystemInfoSync().pixelRatio
                canvas.width = res[0].width * dpr
                canvas.height = res[0].height * dpr
                ctx.scale(dpr, dpr)
                this.ctx = canvas.getContext('2d')
                this.setStroke(canvas.getContext('2d'))
            })
    },

    touchStart: function(e){
        this.ctx.beginPath()
        this.startX = e.touches[0].x
        this.startY = e.touches[0].y
        // 添加历史记录
        this.curDrawArr.push({
            x: e.touches[0].x,
            y: e.touches[0].y
        })
        this.setData({ continuityZ: false})
    },

    touchMove: function(e){
        this.ctx.moveTo(this.startX,this.startY)
        this.ctx.lineTo(e.touches[0].x,e.touches[0].y)
        this.ctx.stroke()
        this.startX = e.touches[0].x
        this.startY = e.touches[0].y
        this.curDrawArr.push({
            x: e.touches[0].x,
            y: e.touches[0].y
        })
    },

    touchEnd: function(e){
        this.ctx.closePath()
        this.drawInfosArr.push({
            drawArr: this.curDrawArr,
            color: this.data.color,
            lineWidth: this.data.thickness
        })
        this.curDrawArr = []
    },

    setStroke: function(res){
        res.strokeStyle = 'this.data.color'              // 设置画笔颜色
        res.lineWidth = this.data.thickness              // 设置画笔宽度
        res.alpha = 1                                       //设置画笔透明度
        res.lineCap = 'round'                        // 线条圆角端点
    },

    clearCanvas: function(){
        this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)
    },

    lineWidthBindChange: function(e){
        this.ctx.lineWidth = e.detail.value
        this.setData({ thickness: e.detail.value })
    },

    colorBindChange: function(e){
        this.ctx.strokeStyle = e.target.dataset.col
        this.setData({ color: e.target.dataset.col })        
    },

    withdrawBindtap: function(e){
        this.clearCanvas()
        for(var i=0 ; i<this.drawInfosArr.length-1 ; i++){
            this.ctx.strokeStyle = this.drawInfosArr[i].color
            this.ctx.lineWidth = this.drawInfosArr[i].lineWidth
            this.ctx.beginPath()
            let drawarr = this.drawInfosArr[i].drawArr
            this.ctx.moveTo(drawarr[0].x,drawarr[0].y)
            for(var j=1 ; j<drawarr.length ; j++){
                this.ctx.lineTo(drawarr[j].x,drawarr[j].y)
                this.ctx.stroke()
                this.ctx.moveTo(drawarr[j].x,drawarr[j].y)                
            }
            this.ctx.closePath()
        }
        this.drawInfosArr.pop()                              // 出栈
        // 将画笔调回到目前设置
        this.ctx.strokeStyle = this.data.color
        this.ctx.lineWidth = this.data.thickness
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.init()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})