require 'rails_helper'

RSpec.describe Account, type: :model do
  describe 'validations' do
    let(:account) { build(:account) }

    it 'is valid with valid attributes' do
      expect(account).to be_valid
    end

    it 'is invalid without an email' do
      account.email = nil
      expect(account).not_to be_valid
      expect(account.errors[:email]).to include("can't be blank")
    end

    it 'is invalid with a too long email' do
      account.email = 'a' * (Settings.email_max_length + 1) + '@example.com'
      expect(account).not_to be_valid
      expect(account.errors[:email]).to include("is too long (maximum is #{Settings.email_max_length} characters)")
    end

    it 'is invalid with an improperly formatted email' do
      account.email = 'invalid_email'
      expect(account).not_to be_valid
      expect(account.errors[:email]).to include("is invalid")
    end

    it 'is invalid without a password' do
      account.password = nil
      expect(account).not_to be_valid
      expect(account.errors[:password]).to include("can't be blank")
    end

    it 'is invalid with a too short password' do
      account.password = '12345'
      expect(account).not_to be_valid
      expect(account.errors[:password]).to include("is too short (minimum is #{Settings.min_password_length} characters)")
    end
  end

  describe 'enums' do
    it 'has the correct roles' do
      expect(Account.roles.keys).to contain_exactly('user', 'teacher', 'admin')
    end

    it 'has the correct statuses' do
      expect(Account.statuses.keys).to contain_exactly('active', 'ban')
    end
  end

  describe 'callbacks' do
    it 'generates activation token before create' do
      account = build(:account)
      expect(account.activation_token).to be_nil
      account.save
      expect(account.activation_token).not_to be_nil
      expect(account.activated).to be(false)
    end
  end

  describe 'methods' do
    let(:account) { create(:account) }

    describe '#generate_reset_password_token' do
      it 'generates a reset password token and sets the timestamp' do
        expect(account.reset_password_token).to be_nil
        expect(account.reset_password_sent_at).to be_nil
        account.generate_reset_password_token
        expect(account.reset_password_token).not_to be_nil
        expect(account.reset_password_sent_at).not_to be_nil
      end
    end

    describe '#password_token_valid?' do
      it 'returns true if the token is still valid' do
        account.generate_reset_password_token
        expect(account.password_token_valid?).to be(true)
      end

      it 'returns false if the token has expired' do
        account.reset_password_sent_at = 3.hours.ago
        expect(account.password_token_valid?).to be(false)
      end
    end

    describe '#reset_password!' do
      it 'resets the password and clears the reset token' do
        account.generate_reset_password_token
        new_password = 'newsecurepassword'
        account.reset_password!(new_password)
        expect(account.authenticate(new_password)).to eq(account)
        expect(account.reset_password_token).to be_nil
      end
    end

    describe '#toggle_status' do
      it 'toggles the status between active and ban' do
        account.active!
        account.toggle_status
        expect(account.ban?).to be(true)
        account.toggle_status
        expect(account.active?).to be(true)
      end
    end
  end

  describe 'associations' do
    it { is_expected.to have_one(:user).dependent(:destroy) }
    it { is_expected.to have_one(:teacher).dependent(:destroy) }
    it { is_expected.to have_many(:comments).dependent(:destroy) }
  end

  describe 'class methods' do
    describe '.ransackable_attributes' do
      it 'returns the correct attributes' do
        expect(Account.ransackable_attributes).to contain_exactly('email', 'status')
      end
    end
  end
end
