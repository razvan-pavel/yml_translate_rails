$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "yml_translate_rails/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "yml_translate_rails"
  s.version     = YmlTranslateRails::VERSION
  s.homepage    = "https://github.com/razvan-pavel/yml_translate_rails"
  s.authors     = ["Razvan Pavel"]
  s.email       = ["pavelrazvan92@gmail.com"]
  s.summary     = "UI for easily writing multiple yml files for one language, visit /yml_translate_rails in your aplication"
  s.description = "UI for easily writing multiple yml files for one language, visit /yml_translate_rails in your aplication. Demo at http://rzone.herokuapp.com/yml_translate"
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
end
