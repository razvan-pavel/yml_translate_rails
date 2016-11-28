# YmlTranslateRails
* An easy way to edit/create I18n yml files for your rails application
* UI interface right on your rails server to change the translations on the run(can be configured on what environments will be available, defaults to development only)
* Before installing this gem you should check this demo [https://rzone.herokuapp.com/yml_translate](https://rzone.herokuapp.com/yml_translate)


## Usage
Go to **<your-server-url>/yml_translate_rails**

Example: [localhost:3000/yml_translate_rails](http://localhost:3000/yml_translate_rails)

Different from the demo app, the gem will automatically read your I18n files and export them in the original locations


* Do not select two files with the same language
* Each file should contain one single language
* Use arrow buttons to navigate the dropdown options
* Use enter or tab button to select a option
* If you want to move to the next field with tab you have to press the space button at the end of text. This will cancel the dropdown selection, move you to the next field and delete the space
* Blank spaces at the end of fields will be deleted automaticaly

## Installation
Add this line to your application's Gemfile(remove the **group: :development** if you want to make this gem available to all environments):

```ruby
gem 'yml_translate_rails', group: :development
```

And then execute:
```bash
$ bundle install
```

Add this in your **/config/routes.rb** file:
```ruby
mount YmlTranslateRails::Engine => "/yml_translate_rails" if defined?(YmlTranslateRails)
```

**Optional** Add this in your **/config/initializers/yml_translate_rails.rb** file to configure the environments were the UI will be available(defaults to development):
```ruby
YmlTranslateRails.configure do |config|
  config.environments = ["development"]
end
```

## Contribue
Please send any comments or suggestions to [pavelrazvan92@gmail.com](mailto:pavelrazvan92@gmail.com) Or just say hi, I would love to know the people who use this gem and get feedback.


## License
The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
