$(function() {

  let UI = {
    templates: {},

    generateTemplates() {
      let $templatesData = $('[type="text/x-handlebars"]').remove();
      $templatesData.each(function () {
        let $title = $(this).attr('id');
        UI.templates[$title] = Handlebars.compile($(this).html());
      });
      $templatesData.filter('[id*="Partial"]')
        .each(function () {
          let $name = $(this).attr('id');
          Handlebars.registerPartial($name, $(this).html());
        });

      Handlebars.registerHelper('checkedTagsHelper', function (tags, tag) {
        if (tags) {
          if (tags.includes(tag)) return 'checked';
        }
      });
    }, 

    bindInput() {
      $('#add-contact,#edit,#add-category').on('blur', 'input', this.getTarget.bind(this));
      $('#add-category input').on('keydown', this.verifyLetter);
      $('#add-contact,#edit').on('keydown', '#full-name', this.verifyLetter);
      $('#add-contact').on('keydown', '#phone', this.verifyNumber);
      $('#edit').on('keydown', '#phone', this.verifyNumber);
    },

    bindSubmit() {
      $('#add-contact form').on('submit', this.addContact.bind(this));
      $('#edit form').on('submit', this.editContact.bind(this));
      $('#add-category form').on('submit', this.addCategory.bind(this));
    },

    bind() {
      $('header').on('click', 'a', this.returnHome.bind(this));
      $(document).on('click', '.add-category', this.showCategory);
      $(document).on('click', '.add-contact', this.showAdd.bind(this));
      $(document).on('click', '.return', this.showMain.bind(this));
      $('#contacts').on('click', this.findButton.bind(this));
      $('#labels').on('click', 'a', this.filterCategory.bind(this));
      $('#search-box').on('keyup', this.search.bind(this));
      this.bindInput();
      this.bindSubmit();
    },

    checkContacts(contacts) {
      if (contacts.length === 0) {
        $('#no-contacts').show();
      } else {
        $('#no-contacts').hide();
      }
    },

    addContact(event) {
      event.preventDefault();
      if (event.target.checkValidity()) {
        API.add(event);
      } else {
        this.validateInputs(event);
      }
    },

    editContact(event) {
      event.preventDefault();
      if (event.target.checkValidity()) {
        API.edit(event);
      } else {
        this.validateInputs(event);
      }
    },

    getId($target) {
      if ($target[0].tagName === "BUTTON") {
        return $target.parent('div').attr('id');
      } else {
        return $('form').filter(':visible').find('[class="hidden"]').val();
      }
    },

    populateAdd(categories) {
      let newContact = this.templates.addEdit({ categories: categories });
      let $addContact = $('#add-contact form');
      if ($('#add-contact form h2').next()[0] !== undefined) {
        $('#add-contact form h2').nextAll().remove();
      }
      $addContact.append(newContact);
    },

    populateCategories() {
      if ($('#tags')) $('#labels').find('*').remove();
      $('#labels').append(this.templates.categories({ categories: ContactManager.categories }));
    },

    populateContacts(contacts) {
      $('#contacts').html(this.templates.contacts({ contacts: contacts }));
    },

    populateEdit(contact) {
      contact.allTags = ContactManager.mapCategories(contact);
      let edit = UI.templates.addEdit(contact);

      let $editH2 = $('#edit form h2');
      let $editForm = $('#edit form');
      if ($editH2.next()[0] !== undefined) {
        $editH2.nextAll().remove();
      }
      $editForm.append(edit);
    },
    
    showAdd() {
      this.populateAdd(ContactManager.categories);
      $('#main').slideUp();
      $('#add-contact').slideDown();
    },

    showCategory(event) {
      event.preventDefault();
      let parent = $(event.currentTarget).parents('section');
      parent.slideUp();
      $('#add-category form')[0].reset();
      $('#add-category div.message').text('Please enter a single category.');
      $('#add-category').slideDown();
    },

    showEdit(event) {
      let id = this.getId($(event.target));
      let contact = ContactManager.retrieveContact(id);
      this.populateEdit(contact);
      $('#main').slideUp();
      $('#edit').slideDown();
    },

    showMain(event) {
      event.preventDefault();
      this.populateCategories();
      let $target = $(event.target);
      $target.parents('section').slideUp();
      $('#main').slideDown();
    },

    returnHome(event) {
      event.preventDefault();
      UI.populateContacts(ContactManager.contacts);
      $('section').filter(':visible').hide();
      $('#main').show();
    },

    filterCategory(event) {
      event.preventDefault();
      let category = $(event.target).text();
      if (category === 'show all') {
        this.populateContacts(ContactManager.contacts);
      } else {
        let filtered = ContactManager.filterByCategory(category);
        UI.populateContacts(filtered);
      }
    },

    removeAlert($target) {
      let $parent = $target.parents('dl');
      if ($target.hasClass('highlight')) {
        $target.removeClass('highlight');
        $parent.find('label').removeClass('highlight');
      }
      $parent.find('.message').text('');
    },

    addAlert($target) {
      $target.parents('dl').find('input, label').addClass('highlight');
    },

    addAlertEmptyMessage($target) {
      let input = $target.parents('dl').find('label').text();
      let message = `A valid ${input} is required.`
      $target.parents('dl').find('.message').text(message);
    },

    addAlertInvalidMessage($target) {
      let input = $target.parents('dl').find('label').text();
      let value = $target.val();
      let message = `${value} is not a valid ${input}.`
      $target.parents('dl').find('.message').text(message);
    },

    getTarget(event) {
      let $target = $(event.target);
      this.verifyInput($target);
    },

    verifyLetter(event) {
      let allowedKeys = ['Tab', 'Shift', 'Backspace', ' '];
      let key = event.key;
      if (allowedKeys.indexOf(key) === -1 && /[^a-z]/i.test(key)) {
        event.preventDefault();
      }
    },
    
    verifyNumber(event) {
      let allowedKeys = ['Tab', 'Shift', 'Backspace'];
      let key = event.key;
      if (allowedKeys.indexOf(key) === -1 && /[^\d\-()]/.test(key)) {
        event.preventDefault();
      }
    },

    validateInputs() {
      $(':invalid').filter(':visible')
        .filter('input')
        .each(function () {
          UI.verifyInput($(this));
        });
    },

    verifyInput($target) {
      if ($target[0].validity.valueMissing) {
        this.addAlert($target);
        this.addAlertEmptyMessage($target);
      } else if ($target[0].validity.patternMismatch) {
        this.addAlert($target);
        this.addAlertInvalidMessage($target);
      } else {
        this.removeAlert($target);
      }
    },

    findButton(event) {
      let $target = $(event.target);
      if ($target.hasClass('edit')) {
        this.showEdit(event);
      } else if ($target.hasClass('delete')) {
        this.confirmDelete(event);
      }
    },

    search(event) {
      let term = event.target.value;
      if (term.length === 0) {
        this.populateContacts(ContactManager.contacts);
        this.hideNoMatch();
      } else {
        let filtered = ContactManager.filterContacts(term);
        if (filtered.length > 0) {
          this.populateContacts(filtered);
        } else {
          this.displayNoMatch(term);
        }
      }
    },

    displayNoMatch(term) {
      let message = `There are no contacts starting with '${term}'.`;
      $('#no-contacts h2').text(message);
      $('#contacts').hide();
      $('#no-contacts').show();
    },

    hideNoMatch() {
      $('#contacts').show();
      $('#no-contacts').hide();
    },

    confirmDelete(event) {
      let message = 'Are you sure you want to delete this contact?';
      let result = window.confirm(message);
      if (result) {
        API.delete(event);
      }
    },

    addCategory(event) {
      event.preventDefault();
      if (event.target.checkValidity()) {
        let value = $(event.target).find('input').val();
        value = value.toLowerCase();
        let $messageElement = $('#add-category div.message');
        if (ContactManager.categoryIsNew(value)) {
          ContactManager.addCategory(value);
          $messageElement.text(`Category '${value}' successfully added.`)
          event.target.reset();
        } else {
          $messageElement.text(`Category '${value}' already exists.`)
        }
      } else {
        this.validateInputs(event);
      }
    },
  };

  let ContactManager = {
    contacts: [],
    categories: [],  

    retrieveCategories() {
      this.contacts.forEach(contact => {
        let categories = contact.tags;
        if (categories) {
          categories.split(',').forEach(category => {
            if (this.categories.indexOf(category) === -1) {
              this.categories.push(category);
            }
          });
        }
      });
    },

    mapCategories(contact) {
      return this.categories.map(category => {
        return {
          'tag': category,
          'tags': contact.tags,
        };
      });
    },

    filterByCategory(category) {
      return this.contacts.filter(contact => {
        if ((contact.tags) && contact.tags.includes(category)) {
          return contact;
        }
      });
    },

    addCategory(categoryName) {
      this.categories.push(categoryName);
    },

    categoryIsNew(categoryName) {
      return this.categories.indexOf(categoryName) === -1
    },

    retrieveContact(id) {
      return this.contacts.filter(contact => contact.id === Number(id))[0];
    },

    filterContacts(term) {
      return this.contacts.filter(contact => {
        let start = contact.full_name.slice(0, term.length);
        if (start === term) {
          return contact;
        }
      });  
    },
  };


  let API = {
    add(event) {
      let $target = $(event.target);
      $.ajax({
        url: $target.attr('action'),
        method: $target.attr('method'),
        data: this.serializeData($target),
      }).done(function(json) {
        $target[0].reset();
        API.fetch();
        UI.showMain(event);
      }).fail(function (textStatus) {
        console.log(textStatus);
      });
    },

    edit(event) {
      let $target = $(event.target);
      let id = UI.getId($target);
      $.ajax({
        url: $target.attr('action') + id,
        method: $target.attr('method'),
        data: this.serializeData($target),
      }).done(function() {
        API.fetch();
        UI.showMain(event);
      }).fail(function (textStatus) {
        console.log(textStatus);
      });
    },

    fetch() {
      $.ajax({
        url: '/api/contacts',
        dataType: 'json',
      }).done(function (json) {
        ContactManager.contacts = json;
        let contacts = ContactManager.contacts;
        if (ContactManager.categories.length === 0) { 
          ContactManager.retrieveCategories();
          UI.populateCategories(); 
        };
        UI.populateContacts(contacts);
        UI.checkContacts(contacts);
      }).fail(function (textStatus) {
        console.log('status: ', textStatus);
      });
    },

    delete(event) {
      let $target = $(event.target);
      let id = UI.getId($target);
      $.ajax({
        url: $target.attr('action') + id,
        method: $target.attr('method'),
        dataType: 'json',
      }).done(function(json) {
        API.fetch();
      }).fail(function (textStatus) {
        console.log(textStatus);
      });
    },

    serializeData($target) {
      let data = $target.serialize();
      if (data.includes('tags')) {
        let index = data.indexOf('tags');
        let [main, tags] = [data.slice(0, index), data.slice(index)];
        tags = tags.replace('&', '')
          .split('tags=')
          .filter(tag => tag !== '')
          .join(',');
        return `${main}tags=${tags}`;
      } else {
        return `${data}&tags=`;
      }
    },
  };
  
  let App = { 
    init() {
      UI.generateTemplates();
      API.fetch();
      UI.bind();
    },
  };

  App.init();
});