module YmlTranslateRails
  module ApplicationHelper
    def get_yml_value yml_hash, up_path
      val = yml_hash.deep_dup

      up_path.each do |i|
        val = val[i] unless val.nil?
      end

      val
    end

    def get_yml_name up_path
      up_path.map { |i| "[#{i}]" }.join
    end
  end
end
