"use strict";

!function () {
  var e = UM.utils,
      i = (UM.browser, {
    supportPreview: ImgPreview.prototype.supportPreview,
    allowAsyn: !0,
    imgPreView: null,
    fileList: [],
    tmpFileInput: [],
    inputs: [],
    checkURL: function checkURL(i) {
      return !!i && !((i = e.trim(i)).length <= 0) && (0 !== i.search(/http:\/\/|https:\/\//) && (i += "http://"), i = i.replace(/\?[\s\S]*$/, ""), !!/(.gif|.jpg|.jpeg|.png)$/i.test(i) && i);
    },
    getAllPic: function getAllPic(e, i, t) {
      var a = [],
          n = $(e, i);
      return $.each(n, function (e, i) {
        return $(i).removeAttr("width").removeAttr("height"), a.push({
          width: 120,
          src: i.src,
          _src: i.src,
          "data-id": i.getAttribute("data-id") || !1
        });
      }), a;
    },
    scale: function scale(e, i, t, a) {
      var n,
          s = 0,
          d = 0,
          o = e.width || t,
          l = e.height || a;
      return (o > i || l > i) && (o >= l ? (s = o - i) && (n = (s / o).toFixed(2), e.height = l - l * n, e.width = i) : (d = l - i) && (n = (d / l).toFixed(2), e.width = o - o * n, e.height = i)), this;
    },
    close: function close(e) {
      return e.css({
        top: (e.parent().height() - e.height()) / 2,
        left: (e.parent().width() - e.width()) / 2
      }).prev().on("click", function () {
        var e = this.getAttribute("data-id");

        if ($(this).parent().remove().hasClass("edui-image-upload-item")) {
          var a = $(".edui-image-close");
          i.tmpFileInput.splice(e, 1);

          for (var n = 0, s = a.length; n < s; n++) {
            a[n].setAttribute("data-id", n);
          }

          t.showCount--, t.updateView();
        }
      }), this;
    },
    generatePreView: function generatePreView(e) {
      this.imgPreView = ImgPreview(e, this.callback);
    },
    preView: function preView(e) {
      var a = $("#edui-dialog-image"),
          n = $("<img src='" + e + "' class='edui-image-pic' data-id=" + t.showCount + " />"),
          s = $("<div class='edui-image-item edui-image-upload-item'><div class='edui-image-close'></div></div>").append(n);
      t.showCount++, $(".edui-image-upload2", a).length < 1 ? ($(".edui-image-content", a).append(s), t.render(".edui-image-content", 2).config(".edui-image-upload2")) : $(".edui-image-upload2", a).before(s).show(), n.on("load", function () {
        i.scale(this, 120), i.close($(this)), $(".edui-image-content", a).focus();
      }), t.toggleMask();
    },
    callback: function callback(e) {
      var a = e;
      t.toggleMask("Loading...."), "[object File]" === Object.prototype.toString.call(e) ? (i.tmpFileInput.push(e), a = ImgPreview.prototype.createObjectURL(e)) : "string" == typeof e && i.tmpFileInput.push(this.fileList), a ? i.preView(a) : (t.toggleMask(), s.showTip("FALSE"), window.setTimeout(function () {
        s.hideTip(), t.toggleMask();
      }, 3e3)), t.updateInput();
    },
    pushFiles: function pushFiles() {
      var e = this.tmpFileInput,
          i = this.fileList,
          t = 0,
          a = e.length;
      if (a) for (t = 0, a = e.length; t < a; t++) {
        i.push(e[t]);
      }
    }
  }),
      t = {
    isInit: !1,
    showCount: 0,
    uploadTpl: '<div class="edui-image-upload%%"><span class="edui-image-icon"></span><form class="edui-image-form" method="post" enctype="multipart/form-data" target="up"><input style="filter: alpha(opacity=0);" class="edui-image-file" type="file" hidefocus name="upfile[]" accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp"/></form></div>',
    init: function init(e, t) {
      return i.inputs.length = 0, this.editor = e, this.dialog = t, this.render(".edui-image-local", 1), this.config(".edui-image-local"), this.submit(), this.drag(), $(".edui-image-upload1").hover(function () {
        $(".edui-image-icon", this).toggleClass("hover");
      }), UM.browser.ie && UM.browser.version <= 9 || $(".edui-image-dragTip", this.dialog).css("display", "block"), this;
    },
    render: function render(e, t) {
      return $(e, this.dialog).append($(this.uploadTpl.replace(/%%/g, t))), i.generatePreView($(".edui-image-file")[0]), this;
    },
    config: function config(e) {
      var t = this.editor.options.imageUrl;
      return t = t + (-1 == t.indexOf("?") ? "?" : "&") + "editorid=" + this.editor.id, window.UMEDITOR_CONFIG.allowSyn && !i.supportPreview && $(e).find(".edui-image-form").attr("action", window.UMEDITOR_CONFIG.imageUrl + "?" + encodeURI("callback=window.parent.imgBase.imgPreView.asynCallback")), this;
    },
    uploadFile: function uploadFile(e) {
      var a,
          n = $("#myEditor").find("img"),
          s = 0,
          d = n.length,
          o = window.UMEDITOR_CONFIG.imageUrl;

      if (0 != n.length) {
        for (var l = new FormData(); s < d; s++) {
          a = parseInt(n[s].getAttribute("data-id")), l.append("upfile[]", i.fileList[a]);
        }

        $.ajax({
          url: o,
          data: l,
          type: "POST",
          dataType: "json",
          processData: !1,
          contentType: !1,
          success: function success(a) {
            if ("SUCCESS" == a.state) {
              for (var s = a.url, d = 0, o = s.length, l = t.editor.textarea, r = l.value; d < o; d++) {
                r = r.replace(n[d].getAttribute("_src"), s[d]);
              }

              l.value = r, e.setAttribute("data-hook", "1"), e.submit();
            } else e.setAttribute("data-hook", "0"), alert(a.state);

            i.fileList.length = 0;
          }
        });
      }
    },
    submit: function submit() {
      $('<input style="filter: alpha(opacity=0);" class="edui-image-file" type="file" hidefocus="" name="upfile[]" accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp">')[0];

      if (!this.isInit) {
        this.isInit = !0;
        var e = $(".edui-image-file")[0].parentElement;

        do {
          e = e.parentElement;
        } while ("FORM" != e.tagName);

        e.setAttribute("data-hook", "0"), i.supportPreview ? $(e).on("submit", function (e) {
          "0" == this.getAttribute("data-hook") && (e.preventDefault(), t.uploadFile(this));
        }) : $(e).on("submit", function (e) {
          $("#umeditor_textarea_myEditor")[0].innerText = $("#myEditor").html(), this.submit();
        });
      }

      return this;
    },
    updateInput: function updateInput() {
      var e = $(".edui-image-upload1"),
          t = $(".edui-image-upload2"),
          a = $('<input style="filter: alpha(opacity=0);" type="file" hidefocus="" name="upfile[]" class="edui-image-file"  accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp">'),
          n = $('<input style="filter: alpha(opacity=0);" type="file" hidefocus="" name="upfile[]" class="edui-image-file"  accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp">');
      e.find(".edui-image-file").replaceWith(a), t.find(".edui-image-file").replaceWith(n), "none" != e[0].style.display ? i.generatePreView(a[0]) : i.generatePreView(n[0]);
    },
    updateView: function updateView() {
      0 === t.showCount && (i.generatePreView($(".edui-image-file")[1]), $(".edui-image-upload2", this.dialog).hide(), $(".edui-image-dragTip", this.dialog).show(), $(".edui-image-upload1", this.dialog).show());
    },
    drag: function drag() {
      i.supportPreview && this.dialog.find(".edui-image-content,.edui-image-file").on("drop", function (e) {
        (e = e || window.event).preventDefault ? e.preventDefault() : e.returnValue = !1;
        var t = e.originalEvent.dataTransfer.files;
        $.each(t, function (e, t) {
          /^image/.test(t.type) ? i.callback(t) : i.callback(null);
        });
      }).on("dragover", function (e) {
        e.preventDefault();
      }).on("dragenter", function (e) {
        e.preventDefault();
      });
    },
    toggleMask: function toggleMask(e) {
      var a = $(".edui-image-mask", this.dialog);
      if (e) $(".edui-image-dragTip", this.dialog).css("display", "none"), $(".edui-image-upload1", this.dialog).css("display", "none"), a.addClass("edui-active").html(e);else {
        if (a.removeClass("edui-active").html(), t.showCount > 0) return this;
        i.supportPreview && $(".edui-image-dragTip", this.dialog).css("display", "block"), $(".edui-image-upload1", this.dialog).css("display", "block");
      }
      return this;
    }
  },
      a = {
    init: function init(e, i) {
      this.editor = e, this.dialog = i, this.initEvt();
    },
    initEvt: function initEvt() {
      var e,
          t = this,
          a = $(".edui-image-searchTxt", t.dialog);
      $(".edui-image-searchAdd", t.dialog).on("click", function () {
        (e = i.checkURL(a.val())) && $("<img src='" + e + "' class='edui-image-pic' />").on("load", function () {
          var e = $("<div class='edui-image-item'><div class='edui-image-close'></div></div>").append(this);
          $(".edui-image-searchRes", t.dialog).append(e), i.scale(this, 120), e.width($(this).width()), i.close($(this)), a.val("");
        });
      }).hover(function () {
        $(this).toggleClass("hover");
      });
    }
  },
      n = null,
      s = null;
  UM.registerWidget("image", {
    tpl: '<link rel="stylesheet" type="text/css" href="<%=image_url%>image.css"><div class="edui-image-wrapper"><ul class="edui-tab-nav"><li class="edui-tab-item edui-active"><a data-context=".edui-image-local" class="edui-tab-text"><%=lang_tab_local%></a></li><li  class="edui-tab-item"><a data-context=".edui-image-JimgSearch" class="edui-tab-text"><%=lang_tab_imgSearch%></a></li></ul><div class="edui-tab-content"><div class="edui-image-local edui-tab-pane edui-active"><div class="edui-image-content"></div><div class="edui-image-mask"></div>' + (i.supportPreview ? '<div class="edui-image-dragTip"><%=lang_input_dragTip%></div>' : "") + '</div><div class="edui-image-JimgSearch edui-tab-pane"><div class="edui-image-searchBar"><table><tr><td><input class="edui-image-searchTxt" type="text"></td><td><div class="edui-image-searchAdd"><%=lang_btn_add%></div></td></tr></table></div><div class="edui-image-searchRes"></div></div></div></div>',
    initContent: function initContent(e, i) {
      var t = e.getLang("image")["static"],
          a = $.extend({}, t, {
        image_url: UMEDITOR_CONFIG.UMEDITOR_HOME_URL + "dialogs/image/"
      });
      if (t) var n = $.parseTmpl(this.tpl, a);
      s = i.edui(), this.root().html(n);
    },
    initEvent: function initEvent(e, i) {
      n = $.eduitab({
        selector: ".edui-image-wrapper"
      }).edui().on("beforeshow", function (e) {
        e.stopPropagation();
      }), t.init(e, i), a.init(e, i);
    },
    buttons: {
      ok: {
        exec: function exec(e, t) {
          var a = "",
              s = n.activate();
          0 == s ? a = ".edui-image-content .edui-image-pic" : 1 == s && (a = ".edui-image-searchRes .edui-image-pic");
          var d = i.getAllPic(a, t, e);
          -1 != s && e.execCommand("insertimage", d), i.pushFiles();
        }
      },
      cancel: {
        exec: function exec() {
          i.tmpFileInput.length = 0;
        }
      }
    },
    width: 700,
    height: 408
  }), i.supportPreview && $("#myEditor").on("drop", function (e) {
    var a,
        n,
        s,
        d = e || window.event,
        o = d.originalEvent.dataTransfer.files,
        l = 0,
        r = o.length,
        u = ($(this), ""),
        g = /^image/;

    for (d.preventDefault ? d.preventDefault() : d.returnValue = !1; l < r; l++) {
      a = o[l], g.test(a.type) && (u += '<img src="' + ImgPreview.prototype.createObjectURL(a) + '" width="200" data-id="' + t.showCount++ + '"></img>', i.fileList.push(a));
    }

    if (this.focus(), window.getSelection && "" !== u && (s = window.getSelection()).rangeCount && s.getRangeAt(0)) {
      var c = document.createElement("div"),
          p = document.createDocumentFragment();

      for ((n = s.getRangeAt(0)).deleteContents(), c.innerHTML = u, l = 0, r = c.childNodes.length; l < r; l++) {
        p.appendChild(c.childNodes[l].cloneNode());
      }

      n.insertNode(p);
    }
  }).on("dragover", function (e) {
    var i = e || window.event;
    i.preventDefault ? i.preventDefault() : i.returnValue = !1;
  }).on("dragenter", function (e) {
    var i = e || window.event;
    i.preventDefault ? i.preventDefault() : i.returnValue = !1;
  }), window.imgBase = i;
}();