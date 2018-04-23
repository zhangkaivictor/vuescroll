// begin importing
import {
  getGutter,
  hideSystemBar,
  createRefreshDomStyle,
  createLoadDomStyle
} from "../../util";
import {createContent} from "./vuescroll-content";
// vueScrollPanel
export default   {
  name: "scrollPanel",
  methods: {
    // trigger scrollPanel options initialScrollX, 
    // initialScrollY
    updateInitialScroll() {
      let x = 0;
      let y = 0;
      if(this.ops.initialScrollX) {
        x = this.ops.initialScrollX;
      }
      if(this.ops.initialScrollY) {
        y = this.ops.initialScrollY;
      }
      this.$parent.scrollTo({
        x,
        y
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      if(!this._isDestroyed) {
        this.updateInitialScroll();
      }
    });
  },
  render(h) { // eslint-disable-line
    let data = {
      class: ["vuescroll-panel"]
    };
    return (
      <div
        {...data}
      >
        {[this.$slots.default]}
      </div>
    );
  },
  props: {
    ops: {
            
    },
    state: {

    }
  }
};

/**
 * create a scrollPanel
 * 
 * @param {any} size 
 * @param {any} vm 
 * @returns 
 */
export function createPanel(h, vm) {
  // scrollPanel data start
  const scrollPanelData = {
    ref: "scrollPanel",
    style: {
      position: "relative",
      height: "100%"
    },
    nativeOn: {
      scroll: vm.handleScroll
    },
    props: {
      ops: vm.mergedOptions.scrollPanel,
      state: vm.scrollPanel.state
    }
  };
  // set overflow only if the in native mode
  if(vm.mode == "native") {
    // dynamic set overflow scroll
    // feat: #11
    if(vm.mergedOptions.scrollPanel.scrollingY) {
      scrollPanelData.style["overflowY"] = vm.vBar.state.size?"scroll":"inherit";
    } else {
      scrollPanelData.style["overflowY"] = "hidden";
    }
    if(vm.mergedOptions.scrollPanel.scrollingX) {
      scrollPanelData.style["overflowX"] = vm.vBar.state.size?"scroll":"inherit";
    } else  {
      scrollPanelData.style["overflowX"] = "hidden";
    }
    let gutter = getGutter();
    if(!getGutter.isUsed) {
      getGutter.isUsed = true;
    }
    if(!gutter) {
      hideSystemBar();
      scrollPanelData.style.height = "100%";
    } else {
      // hide system bar by use a negative value px
      // gutter should be 0 when manually disable scrollingX #14
      if(vm.vBar.state.size && vm.mergedOptions.scrollPanel.scrollingY) {
        scrollPanelData.style.marginRight = `-${gutter}px`;
      }
      if(vm.hBar.state.size && vm.mergedOptions.scrollPanel.scrollingX) {
        scrollPanelData.style.height = `calc(100% + ${gutter}px)`;
      } 
    }
    // clear legency styles of slide mode...
    scrollPanelData.style.transformOrigin = "";
    scrollPanelData.style.transform = "";
  } else if(vm.mode == "slide") {
    scrollPanelData.style["transformOrigin"] = "left top 0px";
    scrollPanelData.style["userSelect"] = "none";
  }
  return (
    <scrollPanel
      {...scrollPanelData}
    >
      {
        _createPanel(vm, h)
      }
    </scrollPanel>
  );
}

function _createPanel(vm, h) {
  
  if(vm.mode == "native") {

    return [createContent(h, vm)];

  } else if(vm.mode == "slide") {
                
    let renderChildren = [vm.$slots.default];
    // handle for refresh
    if(vm.mergedOptions.vuescroll.pullRefresh.enable) {
      // just use user-defined refresh dom instead of default
      if(vm.$slots.refresh) {
        vm.$refs["refreshDom"] = vm.$slots.refresh[0];
        renderChildren.unshift(vm.$slots.refresh[0]);
      } else {
        createRefreshDomStyle();
        let refreshDom = null;
        // front or end of the process.
        if(vm.vuescroll.state.refreshStage == "deactive") {
          refreshDom = (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xmlSpace="preserve">
            <metadata> Svg Vector Icons : http://www.sfont.cn </metadata><g><g transform="matrix(1 0 0 -1 0 1008)"><path d="M500,18L10,473l105,105l315-297.5V998h140V280.5L885,578l105-105L500,18z"></path></g></g></svg>);
        }
        // refreshing
        else if(vm.vuescroll.state.refreshStage == "start") {
          refreshDom = (<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xmlSpace="preserve">
            <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
              <animateTransform attributeType="xml"
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="0.6s"
                repeatCount="indefinite"/>
            </path>
          </svg>);
        }
        // release to refresh, active
        else if(vm.vuescroll.state.refreshStage == "active") {
          refreshDom = (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xmlSpace="preserve">
            <metadata> Svg Vector Icons : http://www.sfont.cn </metadata><g><g transform="matrix(1 0 0 -1 0 1008)"><path d="M10,543l490,455l490-455L885,438L570,735.5V18H430v717.5L115,438L10,543z"></path></g></g></svg>
          );
        }
        // no slot refresh elm, use default
        renderChildren.unshift(
          <div class="vuescroll-refresh" ref="refreshDom" key="refshDom">
            {[refreshDom, vm.pullRefreshTip]}
          </div>
        );
      }
    }
    
    // handle for load
    if(vm.mergedOptions.vuescroll.pushLoad.enable) {
      if(vm.$slots.load) {
        vm.$refs["loadDom"] = vm.$slots.load[0];
        renderChildren.push(vm.$slots.load[0]);
      } else {
        createLoadDomStyle();
        let loadDom = null;
        // front or end of the process.
        if(vm.vuescroll.state.loadStage == "deactive") {
          loadDom = (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xmlSpace="preserve">
            <metadata> Svg Vector Icons : http://www.sfont.cn </metadata><g><g transform="matrix(1 0 0 -1 0 1008)"><path d="M10,543l490,455l490-455L885,438L570,735.5V18H430v717.5L115,438L10,543z"></path></g></g></svg>
          );
        }
        // loading
        else if(vm.vuescroll.state.loadStage == "start") {
          loadDom = (<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xmlSpace="preserve">
            <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
              <animateTransform attributeType="xml"
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="0.6s"
                repeatCount="indefinite"/>
            </path>
          </svg>);
        }
        // release to load, active
        else if(vm.vuescroll.state.loadStage == "active") {
          loadDom = (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xmlSpace="preserve">
            <metadata> Svg Vector Icons : http://www.sfont.cn </metadata><g><g transform="matrix(1 0 0 -1 0 1008)"><path d="M500,18L10,473l105,105l315-297.5V998h140V280.5L885,578l105-105L500,18z"></path></g></g></svg>);
        }
        // no slot load elm, use default
        renderChildren.push(
          <div class="vuescroll-load" ref="loadDom" key="loadDom">
            {[loadDom, vm.pushLoadTip]}
          </div>
        );
      }
    }
    return renderChildren;
  }

}