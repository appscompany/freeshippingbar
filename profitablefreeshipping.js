/* =============================================================
﻿* Copyright: 2016 CupelApps (https://cupelapps.com)
﻿* Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
﻿* ============================================================ */
var loadScript = function (url, callback) {

    /* JavaScript that will load the jQuery library on Google's CDN.
       We recommend this code: http://snipplr.com/view/18756/loadscript/.
       Once the jQuery library is loaded, the function passed as argument,
       callback, will be executed. */

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState) {  //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" ||
                    script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function () {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);

};

var myAppJavaScript = function ($) {
    /* Your app's JavaScript here.
       $ in this scope references the jQuery object we'll use.
       Don't use 'jQuery', or 'jQuery191', here. Use the dollar sign
       that was passed as argument.*/
    //$('body').append('<p>Your app is using jQuery version '+$.fn.jquery+'</p>');
    //javascript writw
    var body = document.getElementsByTagName('body')[0];
   
    var freeshippingbar = "<div id='freeshippingBar'>" +
                      "<span id='shippingmsg' style='line-height: 50px;vertical-align:middle;'></span>" +
                      "</div>"
    $('body').append(freeshippingbar);
    
    $(document).ready(function () {
        
        var emptymoney = "$";
        var shopname = window.location.hostname;
        var threshold = 0;
        var freeshippingbarElement = document.getElementById("freeshippingBar");
        freeshippingbarElement.removeAttribute('style');
        freeshippingbarElement.style.display = "none";
        freeshippingbarElement.style.top = "0px";
        var shippingmsgDiv = document.getElementById("shippingmsg");
        shippingmsgDiv.removeAttribute('style');
        var thresholdcolor = "#fff";
        $.ajax({
            url: 'https://profitablefreeshipping.cupelapps.com/ApiMethods/GetPopOutBoxVariables?ShopName=' + shopname,
            dataType: 'json',
            type: 'post',                       
            success: function (data) {
                var shippingbar = data;
              
                if (shippingbar.IsActive == true)
                {
                    $('body').css('cssText', 'padding-top:' + shippingbar.HeaderHeight + 'px!important;');
                    threshold = shippingbar.Threshold;                 
                    freeshippingbarElement.removeAttribute('style');
                  
                    freeshippingbarElement.style.backgroundColor = shippingbar.HeaderBGColor;
                    freeshippingbarElement.style.color = shippingbar.HeaderForeColor;
                    freeshippingbarElement.style.width = "100%";
                    freeshippingbarElement.style.display = "block";
                    freeshippingbarElement.style.position = "fixed";
                    freeshippingbarElement.style.height = shippingbar.HeaderHeight + "px";
                    freeshippingbarElement.style.verticalAlign = "middle";
                    freeshippingbarElement.style.textAlign = "center";
                    freeshippingbarElement.style.zIndex = "4455555";
                    //freeshippingbarElement.style.top = shippingbar.PaddingTop + "px";
                    thresholdcolor = shippingbar.ThresholdColor;
                    var istop = shippingbar.IsTop.toString();
                    if (istop == 'true') {
                        freeshippingbarElement.style.top = "0px";

                    }
                    else {
                        freeshippingbarElement.style.bottom = "0px";
                    }
                    $(window).scroll(function () {
                        if ($(this).scrollTop() >= 290) {
                            if (istop == 'true') {
                                freeshippingbarElement.style.top = shippingbar.PaddingTop + "px";
                                
                            }
                            else {
                                freeshippingbarElement.style.bottom = shippingbar.PaddingTop + "px";
                            }
                        }
                        else {
                            
                            if (istop == 'true') {
                                $('body').css('cssText', 'padding-top:' + shippingbar.HeaderHeight + 'px!important;');
                                freeshippingbarElement.style.top = "0px";
                            }
                            else {
                                freeshippingbarElement.style.bottom = "0px";
                            }

                            
                            
                        }
                    });
                   
                    freeshippingbarElement.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)";

                    shippingmsgDiv.style.lineHeight = shippingbar.HeaderHeight + "px";
                    shippingmsgDiv.style.fontSize = shippingbar.FontSize + "px";
                    shippingmsgDiv.style.fontFamily = shippingbar.FontFamily;

                    callGetCartAjax();
                }
                else
                {
                    // Do Nothing
                }
            },
            error: function () {
              
            }
        });
       
        
        // Update Values for motivation
        function callGetCartAjax() {
            $.ajax({
                type: 'GET',
                url: '/cart.js',
                dataType: 'json',
                success: function (data) {
                    //var thresholdelement = document.getElementById("thresholdvalue");
                    
                    var shippingmsgelement = document.getElementById("shippingmsg");

                    var cart = data;
                   
                    var thresholdamount = threshold;
                    
                    if (data.items.length == 0) {
                        shippingmsgelement.innerHTML = "<i class='fa fa-truck'></i> Free shipping for order over " + "<span style='color: " + thresholdcolor + ";'>" + emptymoney + thresholdamount + "</span>";
                    }
                    else {
                        // Calculate difference in thresholdamount and cart total_price
                        var cartvalue = data.total_price.toString();
                        cartvalue = cartvalue.replace(/\D/g, '');

                        var diff = (thresholdamount * 1) - ((cartvalue * 1) / 100);


                        var amount = diff * 1;
                        if (diff > 0) {

                            shippingmsgelement.innerHTML = "<i class='fa fa-truck'></i> You are just " + emptymoney + diff + " away from free shipping";
                            //thresholdelement.innerText = emptymoney + thresholdamount;
                        }
                        if (diff <= 0) {


                            shippingmsgelement.innerHTML = "<i class='fa fa-truck'></i> Congratulations you are eligible for free shipping";
                            //thresholdelement.innerText = emptymoney + thresholdamount;
                        }
                    }

                    interval = setTimeout(callGetCartAjax, 500);
                }
            });
        }


    });
};

if ((typeof jQuery === 'undefined') || (parseFloat(jQuery.fn.jquery) < 1.7)) {
    loadScript('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', function () {
        jQuery191 = jQuery.noConflict(true);
        myAppJavaScript(jQuery191);
    });
} else {
    myAppJavaScript(jQuery);
}
