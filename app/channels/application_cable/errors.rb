module ApplicationCable
  module Errors
    class SignalError < StandardError; end

    class NoSessionError < SignalError; end
    class NoDataError < SignalError; end
  end
end
