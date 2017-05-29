module YmlTranslateRails
  class ApplicationController < ActionController::Base
    protect_from_forgery with: :exception
    layout false

    before_action :check_env

    def index
      @all_yml_files = Dir["#{Rails.root}/config/locales/**/*"].sort

      if request.post?
        @yml_file_urls = params[:yml_files]

        if @yml_file_urls.present?
          @yml_files = @yml_file_urls.map { |i| YAML.load(File.read(i)) }
          @yml_file_names = @yml_file_urls.map { |i| i.split("/config/locales/").last }

          @yml_file_struct = {}
          @yml_files.each do |i|
            @yml_file_struct.deep_merge!(i.values.first || {})
          end
        else
          redirect_to root_path, notice: "Please select at least two yml files"
        end
      end
    end

    def export
      params[:yml_file_urls].each_with_index do |i, index|
        main_key = params[:main_key][index]

        File.open(i, "w") do |f|
          f.write Hash[main_key, params[main_key].try(:permit!).to_h].to_yaml(line_width: -1)
                                                                      .gsub(/\ \!ruby.+/, "")
                                                                      .gsub("---\n", "")
                                                                      .gsub(/\Aparameters/, main_key)
                                                                      .gsub("permitted: false", "")
        end
      end

      redirect_to root_path, notice: "Your yml files are exported"
    end

    def new_file
      params[:file_name] = "#{params[:file_name]}.#{params[:language]}.yml" unless params[:file_name].ends_with?(".yml")

      File.open("#{Rails.root}/config/locales/#{params[:file_name]}", "w") do |f|
        f.write Hash[params[:language], nil].to_yaml(line_width: -1).gsub("---\n", "")
      end

      redirect_to root_path, notice: "#{params[:file_name]} was created. You can select it now to populate with #{params[:language]} translations!"
    end

    private

    def check_env
      unless YmlTranslateRails.config.environments.include? Rails.env
        raise ActionController::RoutingError.new('Not Found')
      end
    end
  end
end
