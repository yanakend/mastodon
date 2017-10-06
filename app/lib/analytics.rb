# Singletonは、Mix-inしたクラスのinstanceは同一のインスタンスを返すようになる
require 'singleton'

class Analytics
  # instanceメソッドが定義され、newメソッドがprivateに設定される
  include Singleton

  attr_accessor :t

  def initialize
    @t = Staccato.tracker('UA-106593538-1')
  end
end
