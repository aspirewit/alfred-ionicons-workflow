#!/usr/bin/env ruby
# encoding: utf-8

$LOAD_PATH.unshift(File.expand_path(File.dirname(__FILE__)))

require 'rubygems' unless defined? Gem # rubygems is only needed in 1.8
require 'bundle/bundler/setup'
require 'alfred'
require 'lib/font_awesome'

def generate_feedback(alfred, query)
  feedback = alfred.feedback
  queries  = query.split
  fa       = FontAwesome.new

  fa.select!(queries)
  fa.icons.each { |icon| feedback.add_item(fa.item_hash(icon)) }

  puts feedback.to_alfred
end

def puts_log(str)
  log_file = File.expand_path("~/Library/Logs/Alfred-Workflow.log")
  File.open(log_file, "a+") do |log|
    log.puts "[PUTS LOG]  #{str}\n"
    log.flush
  end
end

Alfred.with_friendly_error do |alfred|
  alfred.with_rescue_feedback = true
  query = ARGV.join(' ').strip
  generate_feedback(alfred, query)
end
