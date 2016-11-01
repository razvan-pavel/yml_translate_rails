require "yml_translate_rails/engine"

module YmlTranslateRails
  # Set global settings for YmlTranslateRails like YmlTranslateRails.configure {|config| config.environments = ["development"] }
  def self.configure &block
    yield @config ||= Config.new
  end

  # Global settings for YmlTranslateRails
  def self.config
    @config ||= Config.new
  end

  class Config
    # environments where this ui will be available
    # @return Array defaults to ["development"]
    attr_accessor :environments

    def initialize
      @environments = ["development"]
    end

    def environments= val
      if val.is_a? Array
        @environments = val
      else
        raise ArgumentError, "Invalid environments array"
      end
    end
  end
end
