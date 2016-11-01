//= require yml_translate_rails/jquery.min

$(function() {
  $("[name*=commit_file]").removeAttr("data-disable-with");
  get_completion();

  // resize_tokenized_fields();
  // $(document).on("resize", resize_tokenized_fields);

  $(document).on("click", ".remove_yml_row", function() {
    var parent_elem, spacer_width;

    parent_elem = $(this).parent();

    if(confirm("You will delete the \"" + (parent_elem.find('.key_name').text().slice(0, -1)) + "\" row and its children! Continue?")) {
      spacer_width = parent_elem.find(".spacer").width();
      parent_elem.nextAll().each(function(i, ielem) {
        if($(ielem).find(".spacer").width() > spacer_width)
          $(ielem).remove();
        else
          return false;
      });
      parent_elem.next("br").remove();
      parent_elem.remove();
    }
  });

  $(document).on("click", ".add_yml_row", function() {
    var cloned_div, dummy_name, html, parent_elem, spacer_width, thread;

    parent_elem = $(this).parent();
    spacer_width = parent_elem.find(".spacer").width();
    dummy_name = "yml_unnamed";

    html = "";
    html += "<div class='yml_row yml_unnamed'>";
    html += "<div class='spacer' style='width: " + (spacer_width + 20) + "px;'>&nbsp;</div>";
    html += "<b class='key_name'>" + dummy_name + ":</b>";
    html += "<a class=\"add_yml_row\" href=\"javascript:void(0);\">Add row</a>";
    html += "<a class=\"remove_yml_row\" href=\"javascript:void(0);\">Remove row</a>";
    html += "<br>";
    html += "</div>";

    cloned_div = $(".tokenized:first").closest(".yml_row").clone();
    cloned_div.find(":input").val("");
    cloned_div.find(".spacer").css("width", spacer_width + 40);

    thread = [dummy_name, parent_elem.find(".key_name").text().slice(0, -1)];
    parent_elem.prevAll(".yml_row").each(function(i, ielem) {
      if($(ielem).find(".spacer").width() < spacer_width) {
        spacer_width = $(ielem).find(".spacer").width();
        thread.push($(ielem).find(".key_name").text().slice(0, -1));
      }
    });

    thread = thread.reverse();
    cloned_div.find(".tokenized").each(function(i, ielem) {
      var ielem_lang;

      ielem_lang = $(ielem).prop("id").split("_")[1];
      $(ielem).prop("id", "_" + ielem_lang + "_" + (thread.join('_')));
      $(ielem).prop("name", "[" + ielem_lang + "][" + (thread.join('][')) + "]");
    });

    if(parent_elem.next(".yml_row").length > 0 && parent_elem.next(".yml_row").find(".tokenized").length > 0)
      parent_elem.next(".yml_row").remove();

    parent_elem.after(cloned_div);
    parent_elem.after(html);
  });

  $(document).on("click", ".key_name", function(e) {
    if(!$(e.target).hasClass("key_name_ok") && $(this).find(":input").length === 0) {
      $(this).html("<input type='text' value='" + ($(this).text().slice(0, -1)) + "' class='key_name_ok_text' /><a href='javascript:void(0);' class='key_name_ok' rel='" + ($(this).text().slice(0, -1)) + "'>Save</a>");
    }
  });

  $(document).on("keydown", ".key_name_ok_text", function(e) {
    if(e.keyCode === 13) {
      e.preventDefault();
      $(this).parent().find(".key_name_ok").click();
    }
  });

  $(document).on("click", ".key_name_ok", function() {
    var deepness, old_value, parent_elem, value;

    parent_elem = $(this).closest(".yml_row");
    value = parent_elem.find(':input').val();
    old_value = $(this).prop("rel");
    deepness = parent_elem.find(".spacer:first").width() / 20;

    parent_elem.removeClass("yml_unnamed");
    parent_elem.find(".key_name").html(value + ":");
    parent_elem.nextAll(".yml_row").each(function(i, ielem) {
      $(ielem).find(".tokenized").each(function(j, jelem) {
        var k, name;

        name = jelem.name.split("]");
        if(name[deepness + 1] === ("[" + old_value)) {
          name[deepness + 1] = "[" + value;
          jelem.name = name.join("]");
          jelem.id = "";
          k = 0;
          while(k < name.length - 1) {
            jelem.id += "_" + (name[k].slice(1));
            ++k;
          }
        }
        else
          return false;
      });
    });
  });

  $(document).on("keydown", ".tokenized", function(e) {
    var dropdown, elem, new_value, selected_div, value;

    elem = $(this);
    value = elem.val();
    dropdown = $("#tokenized_dropdown");

    if(e.keyCode === 9) {
      elem.val(elem.val().trim());
      value = value.trim();
    }

    if(e.keyCode === 27)
      dropdown.hide();

    if(dropdown.length > 0 && dropdown.is(":visible") && dropdown.height() > 0 && !e.ctrlKey) {
      if(e.keyCode === 9 || e.keyCode === 13) {
        e.preventDefault();
        new_value = value.split(" ").slice(0, -1);
        new_value.push(dropdown.find(".selected").text());
        new_value.push("");
        elem.val(new_value.join(" "));
      } else if(e.keyCode === 40 || e.keyCode === 39) {
        selected_div = dropdown.find(".selected");
        selected_div.removeClass("selected");
        if(selected_div.next().length === 0) {
          $(selected_div.parent().children()[0]).addClass("selected");
        } else {
          selected_div.next().addClass("selected");
        }
        e.preventDefault();
      } else if(e.keyCode === 37 || e.keyCode === 38) {
        selected_div = dropdown.find(".selected");
        selected_div.removeClass("selected");
        if(selected_div.prev().length === 0) {
          $(selected_div.parent().children()[selected_div.parent().children().length - 1]).addClass("selected");
        } else {
          selected_div.prev().addClass("selected");
        }
        e.preventDefault();
      }
    }
  });
  $(document).on("keyup", ".tokenized", function(e) {
    var elem, value, word;

    get_completion();
    elem = $(this);
    value = elem.val();

    word = value.split(" ")[value.split(" ").length - 1];
    if(word !== " " && word.length > 0 && e.keyCode !== 27) {
      if(e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40 && e.keyCode !== 13) {
        setTimeout(function() {
          if(value === elem.val()) {
            autocomplete_field(elem, word);
          }
        }, 200);
      }
    }
    else
      $("#tokenized_dropdown").hide();
  });

  $(document).on("focus", ".tokenized", function() {
    update_words_dictionary();
    update_translation_dictionary();
  });

  autocomplete_field = function(elem, word) {
    var lang, word_array, dropdown = $("#tokenized_dropdown");

    if(dropdown.length === 0) {
      dropdown = $("<div id='tokenized_dropdown'></div>").appendTo("body");
      $(document).on("click", function() {
        dropdown.hide();
      });
    }

    dropdown.show();
    dropdown.css("top", elem.offset().top + elem.outerHeight());
    dropdown.css("left", elem.offset().left);
    dropdown.css("width", elem.outerWidth());
    dropdown.off("click");
    dropdown.on("click", function(e) {
      var new_value;
      new_value = elem.val().split(" ").slice(0, -1);
      new_value.push($(e.target).text());
      elem.val(new_value.join(" "));
    });

    lang = elem.prop("id").split("_")[1];
    dropdown.html("");
    word_array = [];

    $.each($(".tokenized[id$=" + (elem.prop('id').split('_').slice(2).join('_')) + "]"), function(i, ielem) {
      var ielem_lang;
      ielem_lang = $(ielem).prop("id").split("_")[1];
      if(ielem_lang !== lang) {
        $.each($(ielem).val().split(" "), function(j, jword) {
          var translation_index;
          translation_index = translation_dictionary[ielem_lang].indexOf(jword.toLowerCase());
          if(translation_index >= 0 && translation_dictionary[lang][translation_index] !== "" && translation_dictionary[lang][translation_index] !== word) {
            word_array.push(translation_dictionary[lang][translation_index]);
          }
        });
      }
    });

    $.each(words_dictionary[lang], function(i, iword) {
      if(iword.indexOf(word.toLowerCase()) >= 0 && iword !== word.toLowerCase())
        word_array.push(iword);
    });

    $.each($.unique(word_array), function(i, iword) {
      if(elem.val().indexOf(" ") === -1)
        iword = iword.substr(0, 1).toUpperCase() + iword.substr(1);

      if(i === 0)
        dropdown.append("<div class='selected'>" + iword + "</div>");
      else
        dropdown.append("<div>" + iword + "</div>");
    });
  }

  update_words_dictionary = function() {
    this.words_dictionary = {};

    $(".tokenized").each(function(i, ielem) {
      var ielem_lang;

      ielem_lang = $(ielem).prop("id").split("_")[1];
      if(words_dictionary[ielem_lang] === void 0)
        words_dictionary[ielem_lang] = [];

      $.each($(ielem).val().split(" "), function(j, jword) {
        words_dictionary[ielem_lang].push(jword.toLowerCase().replace(/[\,\.\!\?\;\:\>\<\#\$\%\&\*\(\)]/g, ''));
      });
    });
  }

  update_translation_dictionary = function() {
    var all_lang = [];

    $(".tokenized").each(function(i, ielem) {
      var ielem_lang;

      ielem_lang = $(ielem).prop("id").split("_")[1];
      if(all_lang.indexOf(ielem_lang) === -1)
        all_lang.push(ielem_lang);
      else
        return false;
    });

    this.translation_dictionary = {};
    $(".tokenized").each(function(i, ielem) {
      var ielem_lang, ielem_val;

      ielem_lang = $(ielem).prop("id").split("_")[1];
      if(translation_dictionary[ielem_lang] === void 0)
        translation_dictionary[ielem_lang] = [];

      ielem_val = $(ielem).val();

      if(ielem_val.indexOf(" ") === -1 && ielem_val.length > 0)
        translation_dictionary[ielem_lang].push(ielem_val.toLowerCase().replace(/[\,\.\!\?\;\:\>\<\#\$\%\&\*\(\)]/g, ''));
      else
        translation_dictionary[ielem_lang].push("");
    });
  }
});

// this.resize_tokenized_fields = function() {
//   var tokenized_width,
//       max_width = $(document).outerWidth()-$(".completion").outerWidth()-20,
//       max_yml_row_elem = null;

//   function max_yml_row() {
//     var max_width = 0;

//     if(max_yml_row_elem == null)
//       $(".yml_row").each(function() {
//         $(this).css("display", "inline");
//         if(max_width <= $(this).width()) {
//           max_width = $(this).width();

//           if($(this).find(".tokenized").length > 0)
//             max_yml_row_elem = $(this);
//         }
//         $(this).css("display", "block");
//       });
//     else {
//       max_yml_row_elem.css("display", "inline");
//       max_width = max_yml_row_elem.width();
//       max_yml_row_elem.css("display", "block");
//     }

//     return max_width;
//   }

//   max_yml_row();
//   tokenized_width = max_yml_row_elem.find(".tokenized:first").outerWidth();
//   while(max_yml_row() > max_width || max_yml_row_elem.height() > 36) {
//     console.log(max_yml_row());
//     tokenized_width -= 50;
//     max_yml_row_elem.find(".tokenized").css("width", tokenized_width+"px")
//   }

//   $(".tokenized").css("width", tokenized_width+"px");
// }

this.get_completion = function() {
  $(".completion_container").each(function() {
    var completed_fields, main_key, percent, total_fields;

    main_key = $(this).data("mainkey");
    total_fields = $(":input[id^=_" + main_key + "_]").length;
    completed_fields = $(":input[id^=_" + main_key + "_]").filter(function() {
      return this.value.length !== 0;
    }).length;

    percent = parseFloat(completed_fields * 100 / total_fields).toFixed(2);
    $(this).find(".completion_percent").html(percent + "%");
    $(this).find(".completion_bar").css("width", percent + "%");

    if(parseInt(percent) === 100)
      $(this).find(".completion_bar").css("background-color", "#0aff00");
    else
      $(this).find(".completion_bar").css("background-color", "");
  });
}

this.highlight_incomplete = function() {
  $(".tokenized").each(function(i, ielem) {
    if($(ielem).val().length == 0)
      $(ielem).addClass("incomplete");
    else
      $(ielem).removeClass("incomplete");
  });
}