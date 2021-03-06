// Generated by CoffeeScript 1.11.1
(function() {
  var _bindToggle, _initializeForm, _submitFormax, hideSection, showSection;

  showSection = function(section) {
    var ie;
    ie = section.parents("html").hasClass("ie");
    if (section.data("readonly")) {
      return;
    }
    if (ie || section.data("action") === 'fixed') {
      section.find(".formax-form").show();
      section.find(".formax-icon").css({
        "font-size": "80px",
        width: "80px",
        height: "80px"
      });
    } else {
      section.find(".formax-icon").animate({
        "font-size": "80px",
        width: "80px",
        height: "80px"
      }, 100);
      section.find(".formax-form").slideDown("fast", function() {
        return section.find("input[type=text]:first").focus();
      });
    }
    return section.find(".formax-summary").hide();
  };


  /*
  Manually contract an expandable section
   */

  hideSection = function(section) {
    var ie;
    if (section.data("action") === 'fixed') {
      return;
    }
    ie = section.parents("html").hasClass("ie");
    if (ie) {
      section.find(".formax-summary").show();
      return section.find(".formax-form").hide();
    } else {
      section.find(".formax-icon").animate({
        "font-size": "35px",
        width: "40px",
        height: "40px"
      }, 100);
      section.find(".formax-summary").fadeIn("slow");
      return section.find(".formax-form").hide();
    }
  };


  /*
  Fetches new data for the given expandable section.
  Note this will take care of binding all dynamic functions.
   */

  window.fetchData = function(section) {
    var url;
    if (section.data("href")) {
      url = section.data('href');
      return fetchPJAXContent(url, "#" + section.attr("id") + " > .formax-container", {
        headers: {
          "X-FORMAX": true
        },
        onSuccess: function() {
          section.data("loaded", true);
          _initializeForm(section);
          if (section.data("fixed")) {
            showSection(section);
          } else {
            _bindToggle(section.find(".formax-icon"));
          }
          return section.show();
        }
      });
    } else {
      return section.data("loaded", true);
    }
  };

  _initializeForm = function(section) {
    var action, buttonName, form, onLoad;
    action = section.data('action');
    form = section.find("form");
    if (action === 'formax' || action === 'redirect' || action === 'open') {
      buttonName = section.data("button");
      if (!buttonName) {
        buttonName = gettext("Save");
      }
      form.off("submit").on("submit", _submitFormax);
      if (!section.data("nobutton")) {
        form.append("<input type=\"submit\" class=\"btn btn-primary submit-button\" value=\"" + buttonName + "\"/>");
        form.find(".form-actions").remove();
      }
      form.find(".submit-button").on("click", function() {
        return $(this).addClass("disabled").attr("enabled", false);
      });
      onLoad = section.data("onload");
      if (onLoad) {
        eval_(onLoad)();
      }
      if (!section.data("fixed")) {
        _bindToggle(section.find(".formax-summary"));
      }
      if (action === 'open') {
        showSection(section);
        window.scrollTo(0, section.offset().top);
      }
    }
    if (action === 'fixed') {
      return form.attr("action", section.data("href"));
    }
  };

  _submitFormax = function(e) {
    var followRedirects, form, section;
    e.preventDefault();
    form = $(this);
    section = form.parents("li");
    followRedirects = section.data("action") === 'redirect';
    return fetchPJAXContent(section.data("href"), "#" + section.attr("id") + " > .formax-container", {
      postData: form.serialize(),
      headers: {
        "X-FORMAX": true
      },
      followRedirects: followRedirects,
      onSuccess: function() {
        var dependents, formax_form;
        _initializeForm(section);
        formax_form = section.find(".formax-form");
        if (formax_form.hasClass("errors")) {
          section.find(".formax-summary").hide();
          formax_form.show();
        } else {
          if (section.data("action") !== 'fixed') {
            hideSection(section);
          }
        }
        dependents = section.data("dependents");
        if (dependents) {
          return $("#id-" + dependents).each(function() {
            return fetchData($(this));
          });
        }
      }
    });
  };

  _bindToggle = function(bindTo) {
    var action, section;
    section = bindTo.parents("li");
    action = section.data('action');
    if (action === 'fixed') {
      return showSection(section);
    } else if (action === 'formax' || action === 'redirect' || action === 'open') {
      return bindTo.off("click").on("click", function() {
        section = $(this);
        if (!bindTo.tagName !== "formax") {
          section = bindTo.parents("li");
        }
        $("ul.formax > li").each(function() {
          if ($(this).attr("id") !== section.attr("id")) {
            return hideSection($(this));
          }
        });
        if (section.find(".formax-form").is(":visible")) {
          return hideSection(section);
        } else {
          return showSection(section);
        }
      });
    } else if (action === 'link') {
      return bindTo.off("click").on("click", function() {
        return document.location.href = section.data('href');
      });
    }
  };

  $(function() {
    $('li .formax-summary').each(function() {
      var section;
      section = $(this);
      return _bindToggle(section);
    });
    $('.formax li').each(function() {
      var section;
      section = $(this);
      return _initializeForm(section);
    });
    return $('li .formax-icon').each(function() {
      var section;
      section = $(this);
      return _bindToggle(section);
    });
  });

}).call(this);
