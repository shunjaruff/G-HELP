if (isset($_POST['beverage']))
{
    switch($_POST['beverage'])
    {
        case 'Milk':
            print 'Milk makes you grow!';
            break;
        case 'Coffee':
            print 'Coffee does not let you sleep!';
            break;
        case 'Tea':
            print 'Tea comes from China!';
            break;
        default:
            print 'Nothing was selected';
            break;
    }
}